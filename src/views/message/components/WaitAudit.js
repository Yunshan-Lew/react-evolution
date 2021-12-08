import { useState, useEffect } from 'react';
import { Form, Radio, Input, Button, Table, message } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '@/store/actions';
import { useQueryTable } from '@/hooks/useQueryTable';
import { useTableHeight } from '@/hooks/useTableHeight';
import { privateInfo } from '@/utils/privateInfo';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const dataSign = 'todo_list';

function WaitAudit(props){
  let [ loading, setLoading ] = useState(false)
  const [ form ] = Form.useForm()
  let [ { pageIndex, pageSize }, { handleChange, handleSearch, resetTable } ] = useQueryTable(form, pullData)
  let [ tableHeight ] = useTableHeight(330)
  const { AjaxList } = props.actions

  useEffect(() => {
    resetTable()
  }, []) // eslint-disable-line

  function pullData(){
    let postData = { ...form.getFieldsValue(), todoType: props.type, pageSize, pageIndex }

    setLoading(true)
		AjaxList({
			url: '/todo/todo/list/new',
			method: 'post',
			data: postData,
      sign: dataSign,
      contentType: 'application/json',
			success: res => setLoading(false),
			fail: res => {
				setLoading(false)
				message.error(res.message)
			}
		})
	}

  let { listData } = props
  const columns = [
    {
      title: '项目编号',
			dataIndex: 'projectNo',
      width: 160,
      align: 'center',
      fixed: 'left',
			key: 0,
      render: (text, record) => <div className="color-primary pointer">{ record.projectNo }</div>
    },
    {
      title: '客户',
			dataIndex: 'customerName',
      width: 100,
      align: 'center',
			key: 1
    },
    {
      title: '手机',
			dataIndex: 'customerPhone',
      width: 120,
      align: 'center',
			key: 2,
      render: (text, record) => privateInfo(record.customerPhone)
    },
    {
      title: '产品模式',
			dataIndex: 'loanModelName',
      align: 'center',
      ellipsis: true,
      key: 3
    },
    {
      title: '贷款期数',
			dataIndex: 'loanTerm',
      width: 80,
      align: 'center',
			key: 4
    },
    {
      title: '贷款本金',
			dataIndex: 'loanAmount',
      width: 100,
      align: 'center',
			key: 5,
      render: (text, record) => `${ (Number(record.loanAmount || 0) / 10000).toFixed(2) }万`
    },
    {
      title: '创建时间',
			dataIndex: 'createTime',
      width: 170,
      align: 'center',
			key: 6
    },
    {
      title: '更新时间',
			dataIndex: 'updateTime',
      width: 170,
      align: 'center',
			key: 7
    },
    {
      title: '项目节点',
			dataIndex: 'processNodeName',
      width: 120,
      align: 'center',
			key: 8
    },
    {
      title: '状态',
			dataIndex: 'status',
      width: 100,
      align: 'center',
			key: 9,
      render: (text, record) => ({ 0: '待审核', 1: '已审核', 2: '已作废', 3: '已移交', 4: '已退回' })[record.status] || '--'
    },
    {
      title: '操作',
      width: 100,
      align: 'center',
      fixed: 'right',
			key: 10,
      render: (text, record) => <Button className="btn-cyan" size="small">审核</Button>
    }
  ]

  return <div>
    <Form form={ form } layout="inline" className="marb-15"
      initialValues={{
        status: -1,
        customer: '',
        operateUser: ''
      }}
    >
      <FormItem label="查询信息" name="status">
        <RadioGroup buttonStyle="solid" onChange={ () => handleSearch(1) }>
          <RadioButton value={ -1 }>不限</RadioButton>
          <RadioButton value={ 0 }>待审核</RadioButton>
          <RadioButton value={ 1 }>已审核</RadioButton>
          <RadioButton value={ 2 }>已作废</RadioButton>
        </RadioGroup>
      </FormItem>
      <FormItem label="客户信息" name="customer">
        <Input placeholder="客户姓名/手机" allowClear onPressEnter={ () => handleSearch(1) } onBlur={ () => handleSearch(1) } />
      </FormItem>
      <FormItem label="操作人" name="operateUser">
        <Input placeholder="操作人姓名/手机" allowClear onPressEnter={ () => handleSearch(1) } onBlur={ () => handleSearch(1) } />
      </FormItem>
    </Form>
    <Table scroll={{ y: tableHeight }} columns={ columns } size="middle" bordered dataSource={ listData.results } pagination={{
      current: pageIndex,
      pageSize: pageSize,
      total: listData.count,
      showTotal: total => `共${ total }条`,
      pageSizeOptions: [15, 30, 50]
    }} onChange={ ({ current, pageSize }) => handleChange(current, pageSize) } loading={ loading } rowKey={ record => record.todoId } />
  </div>
}

// lead stores in
const mapStateToProps = state => ({
  "listData": state.listData[dataSign] || {}
})

// lead actions in
const mapDispatchToProps = dispatch => ({ "actions": bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(WaitAudit)

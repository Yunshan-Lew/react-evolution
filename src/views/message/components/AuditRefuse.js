import React, { useState, useEffect } from 'react';
import { Form, Radio, Input, Select, Button, Table, message } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '@/store/actions';
import { useQueryTable } from '@/hooks/useQueryTable';
import { useTableHeight } from '@/hooks/useTableHeight';
import { privateInfo } from '@/utils/privateInfo';

const Fragment = React.Fragment;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Option = Select.Option;
const dataSign = 'todo_list';

function AuditRefuse(props){
  let [ loading, setLoading ] = useState(false)
  const [ form ] = Form.useForm()
  let [ { pageIndex, pageSize }, { handleChange, handleSearch, resetTable } ] = useQueryTable(form, pullData)
  let [ tableHeight ] = useTableHeight(330)
  const { AjaxList, AjaxSystem } = props.actions

  useEffect(() => {
    getProcessNodes()
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

  function getProcessNodes(){
    AjaxSystem({
			url: '/todo/todo/options/processNode',
			sign: 'process_nodes',
			fail: err => console.error(err)
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
      title: '身份证号',
			dataIndex: 'customerIdcard',
      width: 180,
      align: 'center',
      key: 3,
      render: (text, record) => privateInfo(record.customerIdcard)
    },
    {
      title: '产品模式',
      dataIndex: 'loanModelName',
      width: 100,
      align: 'center',
      ellipsis: true,
      key: 4
    },
    {
      title: '贷款期数',
			dataIndex: 'loanTerm',
      width: 80,
      align: 'center',
			key: 5
    },
    {
      title: '贷款本金',
			dataIndex: 'loanAmount',
      width: 100,
      align: 'center',
			key: 6,
      render: (text, record) => `${ (Number(record.loanAmount || 0) / 10000).toFixed(2) }万`
    },
    {
      title: '创建时间',
			dataIndex: 'createTime',
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
      title: '节点状态',
      dataIndex: 'processStateName',
      width: 160,
      align: 'center',
      key: 9
    },
    {
      title: '待办状态',
			dataIndex: 'status',
      width: 100,
      align: 'center',
			key: 10,
      render: (text, record) => ({ 0: '待处理', 1: '已处理', 2: '已作废', 3: '已移交', 4: '已退回' })[record.status] || '--'
    },
    {
      title: '拒绝原因',
      dataIndex: 'refuseReason',
      width: 180,
      align: 'center',
      key: 11
    },
    {
      title: '拒绝人',
      dataIndex: 'refuseUser',
      width: 180,
      align: 'center',
      key: 12
    },
    {
      title: '操作',
      width: 180,
      align: 'center',
      fixed: 'right',
			key: 13,
      render: (text, record) => <Fragment>
        <Button className="btn-cyan" size="small">保单变更</Button>
        <Button size="small">移交</Button>
      </Fragment>
    }
  ]
  let { processNodeOptions } = props
  return <div>
    <Form form={ form } layout="inline" className="marb-15"
      initialValues={{
        status: -1,
        customer: '',
        operateUser: '',
        processNode: ''
      }}
    >
      <FormItem label="查询信息" name="status">
        <RadioGroup buttonStyle="solid" onChange={ () => handleSearch(1) }>
          <RadioButton value={ -1 }>不限</RadioButton>
          <RadioButton value={ 0 }>待处理</RadioButton>
          <RadioButton value={ 1 }>已处理</RadioButton>
          <RadioButton value={ 3 }>已移交</RadioButton>
          <RadioButton value={ 2 }>已作废</RadioButton>
        </RadioGroup>
      </FormItem>
      <FormItem label="客户信息" name="customer">
        <Input placeholder="客户姓名/手机" allowClear onPressEnter={ () => handleSearch(1) } onBlur={ () => handleSearch(1) } />
      </FormItem>
      <FormItem label="操作人" name="operateUser">
        <Input placeholder="操作人姓名/手机" allowClear onPressEnter={ () => handleSearch(1) } onBlur={ () => handleSearch(1) } />
      </FormItem>
      <FormItem label="项目节点" name="processNode">
        <Select allowClear onChange={ () => handleSearch(1) } style={{ width: '184px' }}>
          <Option value={ '' }>不限</Option>
          {
            processNodeOptions.map((item, index) => <Option value={ item.id } key={ index }>{ item.name }</Option>)
          }
        </Select>
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
  "listData": state.listData[dataSign] || {},
  "processNodeOptions": state.systemData['process_nodes'] || []
})

// lead actions in
const mapDispatchToProps = dispatch => ({ "actions": bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(AuditRefuse)

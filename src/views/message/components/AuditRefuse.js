import React, { useEffect } from 'react';
import { Form, Radio, Input, Select, Button, Table } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '@/store/actions';
import { useWaitTable } from '@/hooks/useWaitTable';
import { useTableHeight } from '@/hooks/useTableHeight';
import { privateInfo } from '@/utils/privateInfo';

const Fragment = React.Fragment;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Option = Select.Option;

function AuditRefuse(props){
  const [ form ] = Form.useForm()
  let [ { requesting, pageIndex, pageSize }, { handleChange, handleSearch, getProcessNodes } ] = useWaitTable(form, props.type, props.actions)
  let [ tableHeight ] = useTableHeight(330)

  useEffect(() => {
    getProcessNodes()
  }, []) // eslint-disable-line

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
      render: (text, record) => record.status === '0' ?
      <Fragment>
        {
          record.processState === 'VISIT_FAIL' || record.processState === 'RISK_REFUSE' || record.processState === 'BACK_VISIT' ?
          <Button className="btn-cyan" size="small">调查变更</Button> : null
        }
        {
          ( record.processNode === 'APPLY_WALKING_MONEY' && record.processState === 'PAYMENT_APPLY_FOR_TURN_DOWN' ) ||
					( record.processNode === 'FINANCE_WALKING_MONEY' && record.processState === 'PAYMENT_APPLY_FOR_TURN_DOWN' ) ||
					( record.processNode === 'APPLY_WALKING_MONEY' && record.processState === 'FINANCIAL_RETURN' ) ?
          <Button className="btn-cyan" size="small">走款变更</Button> : null
        }
        {
          record.processState === 'PROJECT_REFUSE' || record.processState === 'WAIT_BUSINESS_CONFIRM' || record.processState === 'BACK_PROJECT_START' ?
          <Button className="btn-cyan" size="small">报单变更</Button> : null
        }
        {
          record.processNode === 'WEIGHT_RECOVERY' && record.processState === 'WEIGHT_RECOVERY_TURN_DOWN' ?
          <Button size="small">重权变更</Button> : null
        }
        {
          record.processState === 'WAIT_RISK_AUDIT' || record.processState === 'PROCESS_RISK_REFUSE' ?
          <Button size="small">风控审批</Button> : null
        }
        {
          record.processState === 'WIND_CONTROL_REFUSE' ?
          <Button size="small">申请复议</Button> : null
        }
        {
          ( record.processNode === 'VOCATIONAL_WORK' && record.processState === 'MAKE_AN_ORDER_TURN_DOWN' ) ||
					( record.processNode === 'BANK_LOAN' && record.processState === 'BANK_REQUEST_TURN_DOWN' ) ||
					( record.processNode === 'VOCATIONAL_WORK' && record.processState === 'MAKE_AN_ORDER_BANK_RETURN' ) ||
					( record.processNode === 'VOCATIONAL_WORK' && record.processState === 'MAKE_AN_ORDER_REFUSE' ) ?
          <Button size="small">做单变更</Button> : null
        }
        {
          record.processState === 'RONGZU_LOAN_REFUSE' ?
          <Button size="small">融租放款变更</Button> : null
        }
        {
          record.processState === 'EVALUATION_REFUSE' ?
          <Button size="small">评估变更</Button> : null
        }
        {
          record.processState === 'WIND_CONTROL_REFUSE' || record.processState === 'WIND_CONTROL_PREVIEW_REFUSE' || record.processState === 'WIND_CONTROL_RECHECK_REFUSE' ?
          <Button size="small">终止订单</Button> : null
        }
        {
          !['WIND_CONTROL_REFUSE', 'WIND_CONTROL_PREVIEW_REFUSE', 'WIND_CONTROL_RECHECK_REFUSE'].includes(record.processState) ?
          <Button size="small">移交</Button> : null
        }
      </Fragment> : null
    }
  ]
  let { processNodeOptions } = props
  return <div>
    <Form form={ form } layout="inline" className="marb-15"
      initialValues={{
        status: 0,
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
    }} onChange={ ({ current, pageSize }) => handleChange(current, pageSize) } loading={ requesting } rowKey={ record => record.todoId } />
  </div>
}

// lead stores in
const mapStateToProps = state => ({
  "listData": state.listData['todo_list'] || {},
  "processNodeOptions": state.systemData['process_nodes'] || []
})

// lead actions in
const mapDispatchToProps = dispatch => ({ "actions": bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(AuditRefuse)

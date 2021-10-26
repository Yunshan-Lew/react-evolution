import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Form, Input, Select, Cascader, Button, Table, Modal, message } from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined, EditOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import actions from '@/store/actions';
import { cleanNullChildren } from '@/utils/cleanNullChildren';
import { useQueryTable } from '@/hooks/useQueryTable';
import { useTableHeight } from '@/hooks/useTableHeight';
import UserConfigModal from '@/views/page/UserConfigModal';

const Fragment = React.Fragment;
const FormItem = Form.Item;
const Option = Select.Option;
const dataSign = 'system_user';

function UserIndex(props) {
  let [ loading, setLoading ] = useState(false)
  let [ modalV, setModalV ] = useState(false)
  let [ dataForConfig, setDataConfig ] = useState({})
  let { deptOptions } = props
  let { Ajax, AjaxList } = props.actions
  const [ form ] = Form.useForm()
  let [ { pageIndex, pageSize }, { handleChange, handleSearch, resetTable } ] = useQueryTable(form, pullData)
  let [ tableHeight ] = useTableHeight()

  useEffect(() => {
    document.title = '用户管理'
    getOptions()
    resetTable()
  }, [])

  function getOptions(){
		let optionRequests = [
			{ url: '/basic/department/findDepartmentTree', method: 'post', sign: 'dept_options' },
			{ url: '/basic/systemRole/allExcludeMenu', method: 'get', sign: 'role_options' },
      { url: '/basic/duty/findExcludeByDutyId', method: 'post', sign: 'duty_options' }
		]
		optionRequests.forEach(({ url, method, sign, success }) => Ajax({
			url, method, sign, success,
			fail: res => message.error(res.message)
		}))
	}

  function pullData(){
    let orgIdArr = form.getFieldsValue().orgIdArr || []
    let postData = { ...form.getFieldsValue(), "departmentId": orgIdArr[orgIdArr.length - 1] || '', pageSize, pageIndex }
    delete postData.orgIdArr

    setLoading(true)
		AjaxList({
			url: '/basic/systemUser/userPage',
			method: 'get',
			sign: 'system_user',
			data: postData,
			success: res => setLoading(false),
			fail: res => {
				setLoading(false)
				message.error(res.message)
			}
		})
	}

  function swiftAvailable(param){
    let { confirm } = Modal
 		confirm({
      title: '系统消息',
      content: `确认要${ ({ 1: "启用", 0: "禁用" })[param.valid] }【${ param.userName }】吗？`,
      onOk: () => Ajax({
        url: '/basic/systemUser/updateUserState',
        method: 'post',
        data: param,
        success: res => {
          message.success('操作成功')
          pullData()
        },
        onFail: res => message.error(res.message)
      }),
      onCancel:()=>{}
    })
	}

  function startAddUser(){
		setDataConfig({ id: "" })
		setModalV(true)
	}

  function startEditConfig(row){
		let { id } = row
		setDataConfig({ id })
		setModalV(true)
	}

  let { roleOptions } = props
  let { listData } = props
  const columns = [
    {
      title: '员工姓名',
			dataIndex: 'userName',
      width: 130,
      align: 'center',
			key: 0
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      width: 150,
      align: 'center',
      key: 1
    },
    {
      title: '登录名',
      dataIndex: 'accountName',
      width: 150,
      align: 'center',
      key: 2
    },
    {
      title: '状态',
      dataIndex: 'available',
      width: 80,
      align: 'center',
      key: 3,
      render: (text, record) => ({ true: '可用', false: '不可用' })[record.available]
    },
    {
      title: '在职状态',
      dataIndex: 'jobStatus',
      width: 100,
      align: 'center',
      key: 4,
      render: (text, record) => ({ 0: '试用', 1: '正式', 2: '临时', 3: '试用延期', 4: '解聘', 5: '离职', 6: '退休', 7: '无效' })[record.jobStatus] || '--'
    },
    {
      title: '任职信息',
      dataIndex: 'deptDutyInfos',
      align: 'center',
      key: 5,
      render: (text, record) => record.deptDutyInfos.map((item, index) => {
        return item.organName !== item.deptName ?
          <span key={ index }>{ item.organName }-{ item.deptName }-{ item.dutyName }{ index === record.deptDutyInfos.length - 1 ? '' : ' / ' }</span> :
					<span key={ index }>{ item.deptName }-{ item.dutyName }{ index === record.deptDutyInfos.length - 1 ? '' : ' / ' }</span>
      })
    },
    {
      title: '权限角色',
      dataIndex: 'roles',
      align: 'center',
      key: 6,
      render: (text, record) => record.roles.map(item => item.name).join(' / ')
    },
    {
      title: '操作',
      width: 200,
      align: 'center',
      key: 7,
      render: (text, record) => <Fragment>
          <Button icon={ <EditOutlined /> } size="small" onClick={ () => startEditConfig(record) }>编辑</Button>
          {
            record.available ?
              <Button icon={ <LockOutlined /> } type="danger" size="small" onClick={ () => swiftAvailable({ userId: record.id, userName: record.userName, valid: 0 }) }>禁用</Button> :
              <Button icon={ <UnlockOutlined /> } className="btn-green" size="small" onClick={ () => swiftAvailable({ userId: record.id, userName: record.userName, valid: 1 }) }>启用</Button>
          }
      </Fragment>
    }
  ]

  return <div className="page-wrap">
    <div className="page-title">
      <span>用户管理</span>
      <Button icon={ <PlusOutlined /> } type="primary" size="small" onClick={ startAddUser }>新增用户</Button>
    </div>
    <div className="page-search">
      <Form form={ form } initialValues={{
        param: "",
				roleId: "",
				orgIdArr: [],
				status: "",
				jobStatus: ""
      }}>
        <Row gutter={ 20 }>
          <Col span={ 5 }>
            <FormItem label="查询信息" name="param">
              <Input allowClear placeholder="用户名字/手机号" />
            </FormItem>
          </Col>
          <Col span={ 5 }>
            <FormItem label="权限角色" name="roleId">
              <Select>
                <Option value={ '' }>不限</Option>
                {
                  roleOptions.map(item => <Option value={ item.id } key={ item.id }>{ item.name }</Option>)
                }
              </Select>
            </FormItem>
          </Col>
          <Col span={ 5 }>
            <FormItem label="所属公司" name="orgIdArr">
              <Cascader options={ deptOptions } fieldNames={{ label: 'name', value: 'id', children: 'children' }} placeholder="请选择所属公司" />
            </FormItem>
          </Col>
          <Col span={ 5 }>
            <FormItem label="可用状态" name="status">
              <Select allowClear>
                <Option value={ '' }>不限</Option>
                <Option value={ 0 }>禁用</Option>
                <Option value={ 1 }>启用</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={ 5 }>
            <FormItem label="在职状态" name="jobStatus">
              <Select allowClear>
                <Option value={ '' }>不限</Option>
                <Option value={ 0 }>试用</Option>
                <Option value={ 1 }>正式</Option>
                <Option value={ 2 }>临时</Option>
                <Option value={ 3 }>试用延期</Option>
                <Option value={ 4 }>解聘</Option>
                <Option value={ 5 }>离职</Option>
                <Option value={ 6 }>退休</Option>
                <Option value={ 7 }>无效</Option>
              </Select>
            </FormItem>
          </Col>
          <Col className="text-right" span={ 19 }>
            <Button icon={ <SearchOutlined /> } type="primary" onClick={ () => handleSearch(1) }>搜索</Button>
            <Button icon={ <ReloadOutlined /> } onClick={ resetTable }>重置</Button>
          </Col>
        </Row>
      </Form>
    </div>

    <div className="page-table">
      <Table scroll={{ y: tableHeight }} columns={ columns } size="middle" bordered dataSource={ listData.results } pagination={{
        current: pageIndex,
        pageSize: pageSize,
        total: listData.count,
        showTotal: total => `共${ total }条`,
        pageSizeOptions: [15, 30 ,50]
      }} onChange={ ({ current, pageSize }) => handleChange(current, pageSize) } loading={ loading } rowKey={ record => record.id } />
    </div>

    <UserConfigModal visible={ modalV } data={ dataForConfig } operateConfirm={ () => { setModalV(false); pullData() } } cancelConfirm={ () => setModalV(false) } />
  </div>
}

// lead stores in
const mapStateToProps = state => ({
  "listData": state.ListData[dataSign] || {},
  "roleOptions": state.detailData['role_options'] || [],
  "deptOptions": (() => {
		let { dept_options } = state.detailData
		let children = dept_options.length ? dept_options[0]['children'] : []
		return cleanNullChildren(children, 'children')
	})()
})

// lead actions in
const mapDispatchToProps = dispatch => ({ "actions": bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(UserIndex)

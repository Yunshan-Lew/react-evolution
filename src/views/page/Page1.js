import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Form, Input, Select, Cascader, Button, Table, message } from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined, EditOutlined, LockOutlined } from '@ant-design/icons';
import actions from '@/store/actions';
import config from '@/config';

const Fragment = React.Fragment;
const FormItem = Form.Item;
const Option = Select.Option;
const dataSign = 'system_user';

function Page1(props) {
  let [ loading, setLoading ] = useState(false)
  let [ pageIndex, setPageIndex ] = useState(1)
  let [ pageSize, setPageSize ] = useState(config.pageSize)
  let { AjaxList } = props.actions

  useEffect(() => {
    document.title = '用户管理'
    resetTable()
  }, [])

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
      render: (text, record) => record.deptDutyInfos.map(item => {
        return item.organName !== item.deptName ?
          <span>{ item.organName }-{ item.deptName }-{ item.dutyName }</span> :
					<span>{ item.deptName }-{ item.dutyName }</span>
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
      width: 300,
      align: 'center',
      key: 7,
      render: (text, record) => <Fragment>
          <Button icon={ <EditOutlined /> }>编辑</Button>
          <Button icon={ <LockOutlined /> } type="danger">禁用</Button>
      </Fragment>
    }
  ]

  function handleChange(i, s){
		setPageIndex(i)
		setPageSize(s)
		pullData()
	}

	function handleSearch(val){
    setPageIndex(val)
		pullData()
	}

  function pullData(){
    let postData = { pageSize, pageIndex }
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

  function resetTable(){
		setPageIndex(1)
    pullData()
	}

  return <div className="page-wrap">
    <div className="page-title">
      <span>用户管理</span>
      <Button icon={ <PlusOutlined /> } type="primary" size="small">新增用户</Button>
    </div>
    <div className="page-search">
      <Form>
        <Row gutter={ 20 }>
          <Col span={ 5 }>
            <FormItem label="查询信息" name="param">
              <Input allowClear placeholder="用户名字/手机号" />
            </FormItem>
          </Col>
          <Col span={ 5 }>
            <FormItem label="权限角色" name="roleId">
              <Select>

              </Select>
            </FormItem>
          </Col>
          <Col span={ 5 }>
            <FormItem label="所属公司" name="orgIdArr">
              <Cascader />
            </FormItem>
          </Col>
          <Col span={ 5 }>
            <FormItem label="可用状态" name="status">
              <Select>

              </Select>
            </FormItem>
          </Col>
          <Col span={ 5 }>
            <FormItem label="在职状态" name="jobStatus">
              <Select>

              </Select>
            </FormItem>
          </Col>
          <Col className="text-right" span={ 19 }>
            <Button icon={ <SearchOutlined /> } type="primary">搜索</Button>
            <Button icon={ <ReloadOutlined /> }>重置</Button>
          </Col>
        </Row>
      </Form>
    </div>

    <div className="page-table">
      <Table columns={ columns } size="middle" bordered dataSource={ listData.results } pagination={{
        current: pageIndex,
        pageSize: pageSize,
        total: listData.count
      }} onChange={ ({ current, pageSize }) => handleChange(current, pageSize) } loading={ loading } rowKey={ record => record.id } />
    </div>
  </div>
}

// lead stores in
const mapStateToProps = state => ({
  "listData": state.ListData[dataSign]
})

// lead actions in
const mapDispatchToProps = dispatch => ({ "actions": bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Page1)

import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';

function UserInfo(props) {
  useEffect(() => {
    document.title = '登录信息'
  })

  let { userInfo } = props.loginInfo

  let roles = useMemo(() => {
    return (userInfo.roles || []).map(
      (item, index) => `${ item.name }${ index === userInfo.roles.length - 1 ? '' : ' / ' }`
    )
  }, [userInfo.roles])

  let deptDutyInfos = useMemo(() => {
    return (userInfo.deptDutyInfos || []).map(
      (item, index) => `${ item.organName }-${ item.deptName }-${ item.dutyName }${ index === userInfo.deptDutyInfos.length - 1 ? '' : ' / ' }`
    )
  }, [userInfo.deptDutyInfos])

  return <div className="page-wrap">
    <h1>登录信息</h1>
    <Row style={{ width: '750px', lineHeight: 2.5 }} gutter={ 20 }>
      <Col span={ 12 }>
        <b>登录名：</b>{ userInfo.accountName || '--' }
      </Col>
      <Col span={ 12 }>
        <b>用户名：</b>{ userInfo.userName || '--' }
      </Col>
      <Col span={ 12 }>
        <b>性别：</b>{ ({ 1: '男', 2: '女' })[userInfo.gender] }
      </Col>
      <Col span={ 12 }>
        <b>手机号：</b>{ userInfo.mobile || '--' }
      </Col>
      <Col span={ 12 }>
        <b>邮箱：</b>{ userInfo.email || '--' }
      </Col>
      <Col span={ 12 }>
        <b>备注：</b>{ userInfo.comment || '--' }
      </Col>
      <Col span={ 12 }>
        <b>创建时间：</b>{ userInfo.createDate || '--' }
      </Col>
      <Col span={ 12 }>
        <b>更新时间：</b>{ userInfo.updateDate || '--' }
      </Col>
      <Col span={ 12 }>
        <b>权限角色：</b>{ roles.length ? roles : '--' }
      </Col>
      <Col span={ 12 }>
        <b>任职信息：</b>{ deptDutyInfos.length ? deptDutyInfos : '--' }
      </Col>
    </Row>
  </div>
}

// lead stores in
const mapStateToProps = state => ({
	loginInfo: state.loginInfo
})

export default connect(mapStateToProps)(UserInfo)

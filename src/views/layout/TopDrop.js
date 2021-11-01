import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown, Menu, Button } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '@/store/actions';
import { DownOutlined, UserOutlined, BulbOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import UserDataModal from '@/views/layout/UserDataModal';

const MenuItem = Menu.Item;
const Fragment = React.Fragment;

function TopDrop(props){
  let { className, style } = props
  let { userName } = props.userInfo
  let { AjaxRelogin } = props.actions
  let [ modalV, setModalV ] = useState(false)
  let [ brightness, setBrightness ] = useState('1')
  const history = useHistory()

  useEffect(() => {
    let filterValue = ''
		document.documentElement.style.cssText.split(';').forEach(item => {
			let [ key, value ] = item.split(':')
			if( key === 'filter' ) filterValue = value
		})
		let initialFilter = filterValue.replace(/\s(brightness)\(\S+\)/, '')
    document.documentElement.style.filter = `${ initialFilter } brightness(${ brightness })`
  }, [ brightness ])

  function userExit(){
    let { loginOut } = props.actions
    loginOut()
    history.push({ pathname: '/login' })
  }

  const menu = (<Menu>
    <MenuItem key="privateData">
      <Button type="text" size="small" onClick={ () => setModalV(true) }>
        <UserOutlined /> 个人资料
      </Button>
    </MenuItem>
    <MenuItem key="light">
      <Button type="text" size="small" onClick={ () => setBrightness(brightness === '1' ? '.8' : '1') }>
        <BulbOutlined /> { brightness === '1' ? '低' : '高' }亮度
      </Button>
    </MenuItem>
    <MenuItem key="logout">
      <Button type="text" size="small" onClick={ userExit }>
        <ArrowLeftOutlined /> 退出登录
      </Button>
    </MenuItem>
  </Menu>)

  return <Fragment>
    <Dropdown overlay={ menu } placement="bottomRight" trigger="click">
      <Button className={ className } style={ style } size="small">{ userName } <DownOutlined /></Button>
    </Dropdown>

    <UserDataModal visible={ modalV } operateConfirm={ () => { setModalV(false); AjaxRelogin() } } cancelConfirm={ () => setModalV(false) } />
  </Fragment>
}

// lead stores in
const mapStateToProps = state => ({
	userInfo: state.loginInfo['userInfo']
})

// lead actions in
const mapDispatchToProps = dispatch => ({ "actions": bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(TopDrop)

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown, Menu, Button, Avatar } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '@/store/actions';
import { DownOutlined, UserOutlined, BranchesOutlined, BulbOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import UserDataModal from '@/views/layout/UserDataModal';
import Mutator from '@/views/layout/Mutator';

const MenuItem = Menu.Item;
const Fragment = React.Fragment;

function TopDrop(props){
  let { className, style, userInfo } = props
  let headIcon = userInfo.headIcon || 'https://joeschmoe.io/api/v1/random'
  let userName = userInfo.userName || ''
  let { AjaxRelogin } = props.actions
  let [ modalV, setModalV ] = useState(false)
  let [ modalV2, setModalV2 ] = useState(false)
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
    <MenuItem key="mutator">
      <Button type="text" size="small" onClick={ () => setModalV2(true) }>
        <BranchesOutlined /> 修改器
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
      <Button type="text" className={ className } style={ style } size="small">
        <Avatar size="small" src={ headIcon } style={{ marginRight: '6px', marginTop: '-2px' }} />
        { userName }
        <DownOutlined />
      </Button>
    </Dropdown>

    <UserDataModal visible={ modalV } operateConfirm={ () => { setModalV(false); AjaxRelogin() } } cancelConfirm={ () => setModalV(false) } />

    <Mutator visible={ modalV2 } operateConfirm={ () => setModalV2(false) } cancelConfirm={ () => setModalV2(false) } />
  </Fragment>
}

// lead stores in
const mapStateToProps = state => ({
	userInfo: state.loginInfo['userInfo']
})

// lead actions in
const mapDispatchToProps = dispatch => ({ "actions": bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(TopDrop)

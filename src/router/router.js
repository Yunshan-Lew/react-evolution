import React, { useState, useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import browserHistory from '@/utils/browserHistory';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '@/store/actions';
import { Permission } from '@/context/Permission';
import { copyAndRename } from '@/utils/deepCopy';
import App from '@/views/App';
import Login from '@/views/common/Login';
import HomeRouter from '@/router/HomeRouter';

const RootRouter = () => <Router history={ browserHistory }>
  <App>
    <Switch>
      <Route path="/login" component={ Login } />
      <Route path="/home" component={ HomeRouter } />
      {/* 匹配其它 */}
      <Redirect to={ '/home' } />
    </Switch>
  </App>
</Router>

const Index = props => {
  let [ rootPermission , setRootPermission ] = useState([])
  let [ loading, setLoading ] = useState(false)
  const { Ajax } = props.actions
  let { pathname } = window.location

	useEffect(() => {
    /* 获取权限列表 */
		if(pathname !== '/login') {
      setLoading(true)
      Ajax({
  			url: '/auth/queryAuth',
        sign: 'self_auth',
  			success: res => {
          setLoading(false)
  				let data = res.data || {}
  				setRootPermission(copyAndRename(data))
        },
  			fail: err => {
          setLoading(false)
          console.error(err)
        }
  		})
    }
  }, [ pathname, Ajax ])
  return <Permission.Provider value={ loading ? { state: 'waiting' } : rootPermission }>
    <RootRouter />
  </Permission.Provider>
}

// lead stores in
const mapStateToProps = state => ({})

// lead actions in
const mapDispatchToProps = dispatch => ({ "actions": bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Index)

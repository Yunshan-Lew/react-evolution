import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import browserHistory from '@/utils/browserHistory';
import App from '@/views/App'
import Login from '@/views/common/Login'
import HomePage from '@/router/HomePage'

const routers = (
	<Router history={ browserHistory }>
    <App>
      <Switch>
        <Route path="/login" component={ Login } />
        <Route path="/home" component={ HomePage } />
        {/* 匹配其它 */}
        <Redirect to={ '/home' } />
      </Switch>
    </App>
  </Router>
)

export default routers

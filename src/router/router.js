import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import browserHistory from '@/utils/browserHistory';
import App from '@/views/App'
import Login from '@/views/common/Login'
import Home from '@/views/home/Home'
import Page1 from '@/views/page/Page1'
import Page2 from '@/views/page/Page2'

const HomePage = () => <Home>
  <Switch>
    <Route path="/home/page1" component={ Page1 } />
    <Route path="/home/page2" component={ Page2 } />
    <Redirect to={ '/home/page1' } />
  </Switch>
</Home>

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

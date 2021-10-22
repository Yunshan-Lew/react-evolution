import { Route } from 'react-router-dom';
import { useContext } from 'react';
import { Spin } from 'antd';
import { authRender } from '@/utils/authRender';
import { Permission } from '@/context/Permission';
import Page403 from '@/views/page/Page403';

const PermissionRouter = function(props){
  let { path, authSign, component } = props
  const selfAuth = useContext(Permission)
  if( selfAuth.state === 'waiting' ) {
    return <Route path={ path } component={ () => <div className="wait-container"><Spin size="large" /></div> } />
  }
  const isMatch = authSign ? authRender(authSign, selfAuth) : true
  return <Route path={ path } component={ isMatch ? component : Page403 } />
}

export default PermissionRouter

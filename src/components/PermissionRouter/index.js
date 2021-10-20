import { Route } from 'react-router-dom';
import { useContext } from 'react';
import { authRender } from '@/utils/authRender';
import { Permission } from '@/context/Permission';
import Page403 from '@/views/page/Page403';

const PermissionRouter = function(props){
  let { path, authSign, component } = props
  const selfAuth = useContext(Permission)
  const isMatch = authRender(authSign, selfAuth)
  return <Route path={ path } component={ isMatch ? component : Page403 } />
}

export default PermissionRouter

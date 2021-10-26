import { useEffect, useMemo } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '@/store/actions';
import { Layout, Menu, Button } from 'antd';
import { DesktopOutlined } from '@ant-design/icons';
import { authRender } from '@/utils/authRender';
import cookies from 'browser-cookies';
import { copyAndRename } from '@/utils/deepCopy';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

function CommonLayout(props) {
  const { selfAuth } = props
  const history = useHistory()
  let location = useLocation()

  useEffect(() => {
    let logState = cookies.get('tx_logState') === 'true' ? true : false
    if( !logState ) history.push({ pathname: '/login' })
  })

  let current = useMemo(() => {
    let { pathname } = location
		return pathname
	}, [location])

  const userExit = () => {
    let { loginOut } = props.actions
    loginOut()
    history.push({ pathname: '/login' })
  }

  return (
    <Layout>
      <Header className="tx-layout-header bg-fff">
        <Button size="small" className="pull-right" style={{ marginTop: '12px' }}onClick={ userExit }>登出</Button>
      </Header>
      <Layout className="tx-layout-container">
        <Sider className="tx-layout-sider" width={ 180 } collapsible collapsedWidth={ 60 }>
          <Menu selectedKeys={[current]} defaultOpenKeys={['home']} mode="inline" theme="dark">
            <SubMenu key="home" icon={<DesktopOutlined />} title="落地页">
              {
                authRender('system:user:index', selfAuth) ? <Menu.Item key="/home/user">
                  <Link to="/home/user">用户管理</Link>
                </Menu.Item> : null
              }
              {
                authRender('system:department:index', selfAuth) ? <Menu.Item key="/home/page2">
                  <Link to="/home/page2">页面2</Link>
                </Menu.Item> : null
              }
            </SubMenu>
          </Menu>
        </Sider>
        <Content className="tx-layout-content">{ props.children }</Content>
      </Layout>
    </Layout>
  );
}

// lead stores in
const mapStateToProps = state => ({
	selfAuth: copyAndRename(state.detailData['self_auth'])
})

// lead actions in
const mapDispatchToProps = dispatch => ({ "actions": bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(CommonLayout);

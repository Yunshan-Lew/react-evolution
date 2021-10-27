import { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '@/store/actions';
import { Layout, Menu } from 'antd';
import { DesktopOutlined } from '@ant-design/icons';
import { authRender } from '@/utils/authRender';
import { copyAndRename } from '@/utils/deepCopy';
import TopDrop from '@/views/layout/TopDrop';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

function CommonLayout(props) {
  const { selfAuth } = props
  let location = useLocation()

  let current = useMemo(() => {
    let { pathname } = location
		return pathname
	}, [location])

  useEffect(() => {
    let { AjaxRelogin } = props.actions
    AjaxRelogin()
  }, []) // eslint-disable-line

  return (
    <Layout>
      <Header className="tx-layout-header bg-fff">
        <TopDrop className="pull-right" style={{ marginTop: '12px' }} />
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
                  <Link to="/home/page2">登录信息</Link>
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

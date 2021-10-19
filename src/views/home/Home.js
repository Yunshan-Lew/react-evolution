import { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '@/store/actions';
import { Layout, Menu } from 'antd';
import { DesktopOutlined } from '@ant-design/icons'

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

function Home(props) {
  let location = useLocation()
  let { Ajax } = props.actions

  let current = useMemo(() => {
    let { pathname } = location
		return pathname
	}, [location])

  useEffect(() => {
    Ajax({
      url: '/auth/queryAuth',
      sign: 'self_auth',
      fail: err => console.error(err)
    })
  }, [ Ajax ])

  return (
    <Layout>
      <Header className="tx-layout-header bg-fff"></Header>
      <Layout className="tx-layout-container">
        <Sider className="tx-layout-sider" width={ 180 } collapsible collapsedWidth={ 60 }>
          <Menu selectedKeys={[current]} defaultOpenKeys={['home']} mode="inline" theme="dark">
            <SubMenu key="home" icon={<DesktopOutlined />} title="落地页">
              <Menu.Item key="/home/page1">
                <Link to="/home/page1">主页</Link>
              </Menu.Item>
              <Menu.Item key="/home/page2">
                <Link to="/home/page2">登录信息</Link>
              </Menu.Item>
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
	selfAuth: state.detailData['self_auth'] || {}
})

// lead actions in
const mapDispatchToProps = dispatch => ({ "actions": bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Home);

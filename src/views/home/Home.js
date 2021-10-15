import { useMemo } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { DesktopOutlined } from '@ant-design/icons'

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

function Home(props) {
  let current = useMemo(() => {
		let { pathname } = props.location
		return pathname
	}, [props.location])

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

export default withRouter(Home);

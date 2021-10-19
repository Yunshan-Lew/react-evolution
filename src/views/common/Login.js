import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import actions from '@/store/actions';
import { Layout, Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import logoSource from '@/assets/zh_logo.png'
import cookies from 'browser-cookies'

function Login(props){
  const [ form ] = Form.useForm()
  const history = useHistory()

  const rules = {
    username: [{ required: true, message: '该项必填' }],
    password: [{ required: true, message: '该项必填' }]
  }

  let [ loading, setLoading ] = useState(false)

  const reloadAccount = () => {
		let username = cookies.get('ge_username')
    return username && form.setFieldsValue({ username })
	}

  useEffect(() => {
    document.title = '登陆'
    reloadAccount()
    let logState = cookies.get('tx_logState') === 'true' ? true : false
    if( logState ) history.push({ pathname: '/home/mainPage' })
  })

  const getAuthInfo = () => {
    let { Ajax } = props.actions
    Ajax({
      url: '/auth/queryAuth',
      sign: 'self_auth',
      success: res => {
        let data = res.data || {}
        localStorage.setItem('tx_self_auth', JSON.stringify(data), { expires: 7, path: '/' })
      },
      fail: err => console.error(err)
    })
  }

  const loginSubmit = () => {
    form.validateFields()
    .then(value => {
      let { username, password, remember } = value
      let { AjaxLogin } = props.actions
      setLoading(true)
      AjaxLogin({
        data: { username, password, type: 'normal', tenantId: 1 },
        success: res => {
          setLoading(false)
          // 记录账号
          if( remember ){
						cookies.set('ge_username', username, { expires: 7 })
					}
					else {
					 	cookies.erase('ge_username')
				 	}
					// 登录成功
					message.success('登录成功', 1, () => {
						history.push({ pathname: '/home/page1' })
					})
          getAuthInfo()
        },
        fail: err => {
          setLoading(false)
          message.error(err.message)
        }
      })
    })
    .catch(err => {})
  }

  return <Layout className="tx-login-layout">
    <Form form={ form } className="login-form"
      initialValues={{ remember: true }}
      autoComplete="off" size="large"
    >
      <div className="tx-surface-logo" style={{ backgroundImage: `url(${ logoSource })` }}></div>
      <Form.Item name="username" rules={ rules.username }>
        <Input prefix={<UserOutlined />} placeholder="请输入用户名/手机号" />
      </Form.Item>

      <Form.Item name="password" rules={ rules.password }>
        <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" onKeyDown={ e => e.keyCode === 13 ? loginSubmit(e) : null } />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked">
        <Checkbox>记住账号</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button block type="primary" loading={ loading } onClick={ loginSubmit }>登 录</Button>
      </Form.Item>
    </Form>
  </Layout>
}

// lead stores in
const mapStateToProps = state => ({})

// lead actions in
const mapDispatchToProps = dispatch => ({ "actions": bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Login)
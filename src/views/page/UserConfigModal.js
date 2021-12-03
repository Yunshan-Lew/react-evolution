import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '@/store/actions';
import { Modal, Form, Input, Select, Cascader, message, Row, Col, Button } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { cleanNullChildren } from '@/utils/cleanNullChildren';

const FormItem = Form.Item;
const FormList = Form.List;
const Option = Select.Option;
const Fragment = React.Fragment;

function UserConfigModal(props) {
  let { visible, data, deptOptions, dutyOptions, roleOptions } = props
  let { Ajax } = props.actions
  let [ loading, setLoading ] = useState(false)
  const [ infoForm ] = Form.useForm()

  useEffect(() => {
    if( visible ){
      infoForm.resetFields()
      let { id } = data
      if( id ) getOriginData(id)
    }
  }, [ visible ]) // eslint-disable-line

  function getOriginData(userId){
		Ajax({
			url: '/basic/systemUser/findFullUserById',
			data: { userId },
			success: res => {
				let data = res.data || {}
				let { userName, mobile, deptDutyInfos, roles } = data
				let { deptOptions } = props
        infoForm.setFieldsValue({
          userName,
          mobile,
          "deptDutyInfos": ( Array.isArray(deptDutyInfos) && deptDutyInfos.length ) ?
            deptDutyInfos.map(({ deptId, dutyId }) => ({ "deptId": findFullId(deptId, deptOptions), dutyId })) :
            [ { deptId: [], dutyId: "" } ],
          "roleIds": Array.isArray(roles) ? roles.map(item => item.id) : []
        })
      },
			fail: err => console.error(err)
		})
	}

  function findFullId(id, tree){
		let path = []
		const iterate = (sign, arr, pIds) => {
			if( Array.isArray(arr) ) {
				for( let i = 0; i < arr.length; i++ ){
					if( arr[i].id === sign ){
						path = [ ...pIds, sign]
						break
					}
					else {
						iterate(sign, arr[i].children, [...pIds, arr[i].id])
					}
				}
			}
		}
		iterate(id, tree, [])
		return path
	}

  function submitHandle(){
    infoForm.validateFields()
    .then(value => {
      let { id } = data
      let { userName, mobile, accountName, password, deptDutyInfos, roleIds } = value
      let postData = {
        userName, mobile,
        "deptDuties": deptDutyInfos.map(({ deptId, dutyId }) => ({ "companyId": deptId[0], "deptId": deptId[deptId.length - 1], dutyId })),
        "roleIds": roleIds.join(',')
      }
      if( id ) postData['id'] = id
      if( !id ) {
        postData['accountName'] = accountName
        postData['password'] = password
      }

      setLoading(true)
      Ajax({
				url: postData.id ? '/basic/systemUser/updateUser' : '/basic/systemUser/addUser',
        method: 'POST',
				data: postData,
				contentType: 'application/json',
				success: res => {
					message.success('操作成功')
					setLoading(false)
					props.operateConfirm()
				},
				fail: res => {
					message.error(res.message)
					setLoading(false)
				}
			})
    })
    .catch(err => {})
  }

  const rules = {
    userName: [{ required: true, message: '该项必填' }],
    mobile: [{ required: true, message: '该项必填' }, { pattern: /^1\d{10}$/, message: '格式不正确' }],
    accountName: [{ required: true, message: '该项必填' }, { validator: (r, v) => /^\d+$/.test(v) ? Promise.reject(new Error('格式不正确')) : Promise.resolve() }],
    password: [{ required: true, message: '该项必填' }, { pattern: /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,16}$/, message: '密码需6-16位数字、字母组合' }],
    deptId: [{ required: true, message: '该项必填' }],
    dutyId: [{ required: true, message: '该项必填' }],
    roleIds: [{ required: true, message: '该项必填' }]
  }

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 }
  }

  return <Modal visible={ visible } title={ `${ !!data.id ? '编辑' : '新增' }用户` } width={ 500 } maskClosable={ false }
    footer={[
      <Button type="primary" key="confirm" loading={ loading } onClick={ submitHandle }>确认</Button>,
      <Button key="cancel" onClick={ props.cancelConfirm }>取消</Button>
    ]} onOk={ submitHandle } onCancel={ props.cancelConfirm }
  >
    <Form { ...formItemLayout } form={ infoForm } initialValues={{
      userName: "",
			mobile: "",
			accountName: "",
			password: "",
			deptDutyInfos: [{ deptId: [], dutyId: "" }],
			roleIds: []
    }}>
      <FormItem label="用户姓名" name="userName" rules={ rules.userName }>
        <Input placeholder="请输入用户姓名" />
      </FormItem>
      <FormItem label="手机号" name="mobile" rules={ rules.mobile }>
        <Input placeholder="请输入手机号" maxLength={ 11 } />
      </FormItem>
      {
        data.id ? null :
        <FormItem label="登录名" name="accountName" rules={ rules.accountName }>
          <Input placeholder="请输入登录名" maxLength={ 12 } />
        </FormItem>
      }
      {
        data.id ? null :
        <FormItem label="登录密码" name="password" rules={ rules.password }>
          <Input.Password placeholder="请输入登录密码" maxLength={ 16 } />
        </FormItem>
      }
      <FormList name="deptDutyInfos">
      {
        (fields, { add, remove }, { errors }) =>
        <Fragment>
          {
            fields.map((field, index) => (
              <Row gutter={ 10 } key={ field.key }>
                <Col span={ 13 }>
                  <FormItem label={ index === 0 ? '任职信息' : ' ' } colon={ index === 0 } labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} name={[ field.name, "deptId"]} rules={ rules.deptId }>
                    <Cascader options={ deptOptions } fieldNames={{ label: 'name', value: 'id', children: 'children' }} placeholder="所属公司" allowClear />
                  </FormItem>
                </Col>
                <Col span={ 1 }>
                  <span style={{ lineHeight: '32px', marginLeft: '-3px' }}>任</span>
                </Col>
                <Col span={ 7 }>
                  <FormItem wrapperCol={{ span: 24 }} name={[ field.name, "dutyId"]} rules={ rules.dutyId }>
                    <Select allowClear showSearch optionFilterProp="children" placeholder="工作职务">
                      {
                        dutyOptions.map(option => <Option key={ option.id } value={ option.id }>{ option.name }</Option>)
                      }
                    </Select>
                  </FormItem>
                </Col>
                <Col span={ 3 } style={{ lineHeight: '32px' }}>
                  {
                    fields.length > 1 ?
                    <MinusCircleOutlined className="color-red font-18" onClick={ () => remove(field.name) } /> : null
                  }
                  {
                    index === fields.length - 1 && fields.length < 5 ?
                    <PlusCircleOutlined className="color-green font-18" style={{ marginLeft: '5px' }} onClick={ () => add() } /> : null
                  }
                </Col>
              </Row>
            ))
          }
        </Fragment>
      }
      </FormList>
      <FormItem label="权限角色" name="roleIds" rules={ rules.roleIds }>
        <Select mode="multiple" allowClear placeholder="请选择权限角色">
          {
            roleOptions.map(item => <Option key={ item.id } value={ item.id }>{ item.name }</Option>)
          }
        </Select>
      </FormItem>
    </Form>
  </Modal>
}

// lead stores in
const mapStateToProps = state => ({
  "deptOptions": (() => {
		let { dept_options } = state.systemData
		let children = dept_options.length ? dept_options[0]['children'] : []
		return cleanNullChildren(children, 'children')
	})(),
  "dutyOptions": state.systemData['duty_options'] || [],
  "roleOptions": state.systemData['role_options'] || []
})

// lead actions in
const mapDispatchToProps = dispatch => ({ "actions": bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(UserConfigModal)

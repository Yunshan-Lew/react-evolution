import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '@/store/actions';
import { Modal, Form, Input, Select, Cascader, message, Row, Col, Button } from 'antd';
import { cleanNullChildren } from '@/utils/cleanNullChildren';

const FormItem = Form.Item;
const Option = Select.Option;

function UserConfigModal(props) {
  let { visible, data, deptOptions, dutyOptions, roleOptions } = props
  let { Ajax } = props.actions
  let [ loading, setLoading ] = useState(false)
  let [ deptDuties, setDeptDuties ] = useState(['item'])
  const [ form ] = Form.useForm()

  useEffect(() => {
    if( visible ){
      form.resetFields()
      setDeptDuties(['item'])
      let { id } = data
      if( id ) getOriginData(id)
    }
  }, [ visible ])

  function getOriginData(userId){
		Ajax({
			url: '/basic/systemUser/findFullUserById',
			data: { userId },
			success: res => {
				let data = res.data || {}
				let { userName, mobile, deptDutyInfos, roles } = data
				let { deptOptions } = props
        setDeptDuties(deptDutyInfos.map(item => 'item'))
        form.setFieldsValue({
          userName,
          mobile,
          "roleIds": Array.isArray(roles) ? roles.map(item => item.id) : []
        })
				Array.isArray(deptDutyInfos) && deptDutyInfos.length ?
        deptDutyInfos.forEach((item, index) => form.setFieldsValue({
          [`deptId_${ index }`]: findFullId(item.deptId, deptOptions),
          [`dutyId_${ index }`]: item.dutyId
        }))
        :
        void(0)

        console.log(form.getFieldsValue())
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
    form.validateFields()
    .then(value => {
      let { id } = data
      let { userName, mobile, accountName, password, roleIds } = value
      let postData = { userName, mobile, "deptDuties": [], "roleIds": roleIds.join(',') }
      if( id ) postData['id'] = id
      if( !id ) {
        postData['accountName'] = accountName
        postData['password'] = password
      }
      deptDuties.forEach((item, index) => {
        let dept = value[`deptId_${index}`]
        let dutyId = value[`dutyId_${index}`]
        postData.deptDuties.push({ "companyId": dept[0], "deptId": dept[dept.length - 1], dutyId })
      })

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

  return <Modal visible={ visible } title={ `${ !!data.id ? '编辑' : '新增' }用户` } width={ 450 }
    footer={[
      <Button type="primary" key="confirm" loading={ loading } onClick={ submitHandle }>确认</Button>,
      <Button key="cancel" onClick={ props.cancelConfirm }>取消</Button>
    ]}  onOk={ submitHandle } onCancel={ props.cancelConfirm }
  >
    <Form { ...formItemLayout } form={ form } initialValues={{
      userName: "",
			mobile: "",
			accountName: "",
			password: "",
			deptId_0: [],
      dutyId_0: "",
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
      {
        deptDuties.map((item, index) => <Row gutter={ 10 } key={ index }>
            <Col span={ 14 }>
              <FormItem label="任职信息" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} name={ `deptId_${ index }` } rules={ rules.deptId }>
                <Cascader options={ deptOptions } fieldNames={{ label: 'name', value: 'id', children: 'children' }} placeholder="所属公司" allowClear />
              </FormItem>
            </Col>
            <Col span={ 1 }>
              <span style={{ lineHeight: '32px' }}>任</span>
            </Col>
            <Col span={ 9 }>
              <FormItem style={{ width: '128px' }} wrapperCol={{ span: 24 }} name={ `dutyId_${ index }` } rules={ rules.dutyId }>
                <Select allowClear showSearch placeholder="工作职务">
                  {
                    dutyOptions.map(option => <Option key={ option.id } value={ option.id }>{ option.name }</Option>)
                  }
                </Select>
              </FormItem>
            </Col>
          </Row>
        )
      }
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
		let { dept_options } = state.detailData
		let children = dept_options.length ? dept_options[0]['children'] : []
		return cleanNullChildren(children, 'children')
	})(),
  "dutyOptions": state.detailData['duty_options'] || [],
  "roleOptions": state.detailData['role_options'] || []
})

// lead actions in
const mapDispatchToProps = dispatch => ({ "actions": bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(UserConfigModal)

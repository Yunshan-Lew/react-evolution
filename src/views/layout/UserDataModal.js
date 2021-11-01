import { useState, useEffect, useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '@/store/actions';
import { Modal, Form, Input, Radio, Upload, Button, message, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { setPicReturn } from '@/utils/setImageValue';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;

function UserDataModal(props){
  let { visible, userInfo } = props
  let { userName } = userInfo
  let { AjaxFile } = props.actions
  let [ loading, setLoading ] = useState(false)
  let [ imgCount, setImgCount ] = useState(0)
  const [ infoForm ] = Form.useForm()

  useEffect(() => {
    let detail = props.userInfo
    infoForm.setFieldsValue({
      headImg: setPicReturn(detail['headIcon'] || []),
			gender: detail.gender || 1,
			email: detail.email,
			comment: detail.comment
    })
    setImgCount((detail['headIcon'] || []).length)
  }, [visible]) // eslint-disable-line

  function submitHandle(){
    let { headImg, gender, email, comment } = infoForm.getFieldsValue()
    let { mobile, id } = userInfo
    let postData = { mobile, gender, id }
		if( !!email ) postData['email'] = email
		if( !!comment ) postData['comment'] = comment
		let avatar = headImg.map(item => item.originFileObj || item.url)
    // 转化为FormData
		let formData = new FormData()
		Object.keys(postData).forEach(item => formData.append(item, postData[item]))
    avatar.forEach(file => formData.append(typeof file === 'string' ? 'headIcon' : 'headImg', file))

    setLoading(true)
    AjaxFile({
			url: '/basic/systemUser/updateCurrentUser',
      data: formData,
			success: res => {
				message.success('编辑成功')
				setLoading(false)
        props.operateConfirm()
			},
			fail: res => {
				message.error(res.message)
				setLoading(false)
			}
		})
  }

  function catchFile(e){
		if (Array.isArray(e)) return e
		return e && e.fileList
	}

  let deptDuty = useMemo(() => {
    let deptDutyInfos = userInfo['deptDutyInfos'] || []
		return deptDutyInfos[0] || {}
  }, [ userInfo ])

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 19 }
  }

  return <Modal visible={ visible } title={ `${ userName }的资料` } width={ 600 } maskClosable={ false } forceRender
    footer={[
      <Button type="primary" key="confirm" loading={ loading } onClick={ submitHandle }>确认</Button>,
      <Button key="cancel" onClick={ props.cancelConfirm }>取消</Button>
    ]} onOk={ submitHandle } onCancel={ props.cancelConfirm }
  >
    <Form { ...formItemLayout } form={ infoForm } initialValues={{
      headImg: [],
      gender: 1,
			email: '',
			comment: ''
    }}>
      <Row>
        <Col span={ 9 }>
          <FormItem label={ '　' } labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}
            colon={ false } name="headImg"
            valuePropName="fileList" getValueFromEvent={ catchFile }
          >
            <Upload name="file"
              beforeUpload={ () => false }
              onChange={ ({ fileList }) => setImgCount(fileList.length) }
              maxCount={ 1 } listType="picture-card"
              showUploadList={{ showPreviewIcon: false }}
            >
              { imgCount > 0 ? null : <PlusOutlined /> }
            </Upload>
          </FormItem>
        </Col>
        <Col span={ 14 }>
          <div className="user-info-card">
            用户名：<b>{ userInfo.userName }</b><br/>
            登录名：<b>{ userInfo.accountName }</b><br/>
            手机号：<b>{ userInfo.mobile }</b><br/>
            任职信息：{
              Object.keys(deptDuty).length ?
              <b>{ deptDuty.organName === deptDuty.deptName ? deptDuty.organName : deptDuty.organName + deptDuty.deptName } 任 { deptDuty.dutyName }</b> : <b>无</b>
            }
          </div>
        </Col>
      </Row>
      <FormItem label="性别" name="gender">
        <RadioGroup>
          <Radio value={ 1 }>男</Radio>
          <Radio value={ 2 }>女</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="邮箱" name="email">
        <Input placeholder="请填写邮箱，选填" />
      </FormItem>
      <FormItem label="备注" name="comment">
        <TextArea placeholder="请填写个人简介，40字内，选填" rows={ 5 } />
      </FormItem>
    </Form>
  </Modal>
}

// lead stores in
const mapStateToProps = state => ({
	userInfo: state.loginInfo['userInfo'] || {}
})

// lead actions in
const mapDispatchToProps = dispatch => ({ "actions": bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(UserDataModal)

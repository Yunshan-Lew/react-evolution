import { useState, useEffect, useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '@/store/actions';
import { Modal, Form, Select, Input, Button, message, Row, Col } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

function Mutator(props){
  let { visible } = props
  let { Ajax } = props.actions
  let [ loading, setLoading ] = useState(false)
  let [ currentType, setCurrentType ] = useState(1)
  const [ infoForm ] = Form.useForm()

  useEffect(() => {
    if( visible ){
      infoForm.resetFields()
    }
  }, [visible]) // eslint-disable-line

  const url = useMemo(() => {
    return ({
			1: '/pre/maintain/credit/restoreAntiFraud',
			2: '/pre/maintain/credit/updateAntiFraudPass',
			3: '/pre/maintain/customer/customerLoanComplete',
			4: '/pre/maintain/process/unconditionalStop',
			5: '/pre/project/findByProjectNo',
			6: '/pre/estages/agencySign',
			7: '/pre/test/return/vocational',
			8: '/walk/temp/zcAdvicePay',
			9: '/pre/project/findByProjectNo',
			10: '/pre/estages/signVideoNull'
		})[currentType]
  }, [ currentType ])

  const numLabelName = useMemo(() => {
    return ({
			1: '征信编号',
			2: '征信编号',
			3: '客户编号',
			4: '项目编号',
			5: '项目编号',
			6: '项目编号',
			7: '项目编号',
			8: '资产编号',
			9: '项目编号',
			10: '验证秘钥'
		})[currentType]
  }, [ currentType ])

  const numKeyName = useMemo(() => {
    return ({
			1: 'querySn',
			2: 'querySn',
			3: 'customerNum',
			4: 'projectNo',
			5: 'projectNo',
			6: 'projectNo',
			7: 'projectNo',
			8: 'zcId',
			9: 'projectNo',
			10: 'secretCode'
		})[currentType]
  }, [ currentType ])

  const urlShow = useMemo(() => {
    if( currentType === 5 ) return '/walk/sxf/stop (POST)'
    if( currentType === 9 ) return '/process/v4/compensate/weight/recovery (GET)'
    return `${ url } (GET)`
  }, [ currentType, url ])

  const paramsShow = useMemo(() => {
    return `${ [5, 9].includes(currentType) ? 'orderId' : numKeyName } ${ [1, 2, 3, 4].includes(currentType) ? 'comment' : '' }`
  }, [ currentType, numKeyName ])

  function submitHandle(){
    infoForm.validateFields()
    .then(value => {
      let { mutateType, num, comment } = value
      let data = { [numKeyName]: num }
			if( comment ) data['comment'] = comment
      setLoading(true)
      Ajax({
  			url, data,
  			success: res => {
          if( [5, 9].includes(mutateType) ){
						let data = res.data || {}
						if( mutateType === 5 ) stopSxf(data.id || null)
						if( mutateType === 9 ) weightRecovery(data.id || null)
					}
					else {
    				message.success('操作成功')
    				setLoading(false)
            props.operateConfirm()
          }
  			},
  			fail: res => {
  				message.error(res.message)
  				setLoading(false)
  			}
  		})
    })
    .catch(err => {})
  }

  function stopSxf(id){
  	if( !id ) {
  		setLoading(false)
  		return message.warning('未查询到项目ID')
  	}
  	Ajax({
  		url: `/walk/sxf/stop?orderId=${ id }`,
      method: 'POST',
  		success: res => {
  			setLoading(false)
  			message.success('操作成功')
        props.operateConfirm()
  		},
  		fail: res => {
  			setLoading(false)
  			message.error(res.message)
  		}
  	})
  }

	function weightRecovery(id){
		if( !id ) {
			setLoading(false)
			return message.warning('未查询到项目ID')
		}
		Ajax({
			url: '/process/v4/compensate/weight/recovery',
			data: { "orderId": id },
			success: res => {
				setLoading(false)
				message.success('操作成功')
				props.operateConfirm()
			},
			fail: res => {
				setLoading(false)
				message.error(res.message)
			}
		})
	}

  function typeHandle(){
    infoForm.setFieldsValue({ comment: '' })
    let { mutateType } = infoForm.getFieldsValue()
    return setCurrentType(mutateType)
  }

  const rules = {
    mutateType: [ { required: true, message: '该项必选' } ],
		num: [ { required: true, message: '该项必填' } ],
		comment: [ { required: true, message: '该项必填' } ]
  }

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 19 }
  }

  return <Modal visible={ visible } title="修改器" width={ 490 } maskClosable={ false } forceRender
    footer={[
      <Button type="primary" key="confirm" loading={ loading } onClick={ submitHandle }>确认</Button>,
      <Button key="cancel" onClick={ props.cancelConfirm }>取消</Button>
    ]} onOk={ submitHandle } onCancel={ props.cancelConfirm }
  >
    <Form { ...formItemLayout } form={ infoForm } initialValues={{
      mutateType: 1,
			num: "",
			comment: ""
    }}>
      <FormItem label="修改类型" name="mutateType" rules={ rules.mutateType }>
        <Select showSearch optionFilterProp="children" onChange={ typeHandle }>
          <Option value={ 1 }>还原主借人反欺诈结果</Option>
          <Option value={ 2 }>修改主借人反欺诈通过</Option>
          <Option value={ 3 }>修改客户报单状态为已完成</Option>
          <Option value={ 4 }>无条件终止项目</Option>
          <Option value={ 5 }>无条件终止随行付</Option>
          <Option value={ 6 }>机构补签</Option>
          <Option value={ 7 }>电子签退回</Option>
          <Option value={ 8 }>付款交易申请</Option>
          <Option value={ 9 }>补偿无重权回收</Option>
          <Option value={ 10 }>面签数据为空的补偿</Option>
        </Select>
      </FormItem>
      <Row>
        <Col span={ 19 } offset={ 4 }>
          <p className="api-info font-12">
            接口路径：<br/>
            <span className="color-primary">{ urlShow }</span><br/>
            参数字段：<br/>
            <span className="color-primary">{ paramsShow }</span>
          </p>
        </Col>
      </Row>
      <FormItem label={ numLabelName } name="num" rules={ rules.num }>
        <Input placeholder={ `请输入${ numLabelName }` } maxLength={ 20 } />
      </FormItem>
      {
        [1, 2, 3, 4].includes(infoForm.getFieldValue('mutateType')) ?
        <FormItem label="备注" name="comment" rules={ rules.comment }>
          <TextArea placeholder="选填，50字以内" rows={ 4 } maxLength={ 50 } />
        </FormItem> : null
      }
    </Form>
  </Modal>
}

// lead stores in
const mapStateToProps = state => ({})

// lead actions in
const mapDispatchToProps = dispatch => ({ "actions": bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Mutator)

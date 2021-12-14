import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '@/store/actions';
import { Badge, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { authRender } from '@/utils/authRender';
import WaitAudit from '@/views/message/components/WaitAudit';
import AuditRefuse from '@/views/message/components/AuditRefuse';
import { copyAndRename } from '@/utils/deepCopy';
import { parseQueryString } from '@/utils/toQueryString';

const antIcon = <LoadingOutlined style={{ fontSize: 28 }} spin />;

function Wait(props){
  let { Ajax } = props.actions
  let history = useHistory()
  let [ loading, loadingUpdate ] = useState(false)
  let [ active, activeUpdate ] = useState('')
  let [ leftSides, leftSidesUpdate ] = useState([])

  useEffect(() => {
    document.title = '待办事项'
    activeUpdate(selectCurrent())
    getTypeAndNum()
  }, []) // eslint-disable-line

  function selectCurrent(){
    let query = parseQueryString()
    return query.select || ''
  }

  // 侧边切换
  function sideClick(item) {
    activeUpdate(item.code)
    history.replace({ pathname: '/home/wait', search: `?select=${ item.code }` })
  }

  // 待办类型与数量
	function getTypeAndNum(){
    loadingUpdate(true)
    Ajax({
      url: '/todo/todo/type/list/new',
      success: res => {
        loadingUpdate(false)
        let data = res.data || []
        // 重命名字段
        let data2 = Array.isArray(data) ? data.map(({ name, count, type }) => ({
          "code": type,
          name,
          count
        })) : []
        // 添加属性
        let data3 = data2.map(item => ({
          /* 示例：
            name: '待审核',
            code: 'TODO_TYPE01',
            count: 17,
            component: <WaitAudit />,
            authName: 'work:board:wait:audit'
          */
          ...item,
          ...getUnitProps(item.code)
        }))
        leftSidesUpdate(data3)
        // 无URL参数时的定位
        let { selfAuth } = props
        let active = 0
        while( active < data3.length ){
          if( authRender(data3[active]['authName'], selfAuth) ) break
          active++
        }
        if( !selectCurrent() && data3.length ) activeUpdate(data3[active]['code'])
      },
      fail: err => {
        loadingUpdate(false)
        console.error(err)
      }
    })
  }

  // 注入单元属性
  function getUnitProps(C){
    let attr = { type: C, refreshNum: getTypeAndNum }
    let props = {
      /* 新待办 */
      TODO_TYPE01: { component: <WaitAudit { ...attr } />, authName: 'work:board:wait:audit' }, // 待审核
      TODO_TYPE02: { component: <AuditRefuse { ...attr } />, authName: 'work:board:wait:refuse' }, // 审核退回
    }
    return props[C] || { component: null, authName: null }
  }

  return <div className="page-wrap">
    <div className="page-title">
      <span>待办事项</span>
    </div>
    <div className="page-content">
      <div className="message-side">
        { loading ? <Spin className="spin-center" indicator={antIcon} /> : null }
        {
          leftSides.map((item, index) => {
            return authRender(item.authName, props.selfAuth) ?
            <div
              className={ `side-item low ${ active === item.code ? 'side-item-select' : 'side-item-default' }` }
              onClick={ () => sideClick(item) }
              key={ index }
            >
              { item.name }
              { item.count ? <Badge count={ item.count } /> : null }
            </div> : null
          })
        }
      </div>
      <div className="message-content">
        { getUnitProps(active).component }
      </div>
    </div>
  </div>
}

// lead stores in
const mapStateToProps = state => ({
  selfAuth: copyAndRename(state.detailData['self_auth'])
})

// lead actions in
const mapDispatchToProps = dispatch => ({ "actions": bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Wait)

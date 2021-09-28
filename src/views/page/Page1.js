import { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '@/store/actions';

function Page1(props) {
  let { relation } = props.detailData

  useEffect(() => {
    let { AjaxLogin } = props.actions
    document.title = 'Page1'
    AjaxLogin({
      data: { username: "admin", password: "admin123456", type: "normal", tenantId: 1 }
    })
  }, [props.actions])

  return <h1>This is Page1, { relation }</h1>
}

// lead stores in
const mapStateToProps = state => ({
	detailData: state.detailData
})

// lead actions in
const mapDispatchToProps = dispatch => ({ "actions": bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Page1)

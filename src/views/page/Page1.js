import { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '@/store/actions';

function Page1(props) {
  let { relation } = props.detailData
  useEffect(() => {
    document.title = '主页'
  })

  return <div className="page-wrap">
    <h1>This is Page1, { relation }</h1>
  </div>
}

// lead stores in
const mapStateToProps = state => ({
	detailData: state.detailData
})

// lead actions in
const mapDispatchToProps = dispatch => ({ "actions": bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Page1)

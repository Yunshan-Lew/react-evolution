import React, { useEffect } from 'react';
import { connect } from 'react-redux';

function Page2(props) {
  useEffect(() => {
    document.title = '页面2'
  })

  let { userInfo } = props.loginInfo

  return <div className="page-wrap">
    <h1>This is Page2</h1>
    <p>{ JSON.stringify(userInfo) }</p>
  </div>
}

// lead stores in
const mapStateToProps = state => ({
	loginInfo: state.loginInfo
})

export default connect(mapStateToProps)(Page2)

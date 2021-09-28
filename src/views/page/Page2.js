import React, { useEffect } from 'react';
import { connect } from 'react-redux';

const Fragment = React.Fragment

function Page2(props) {
  useEffect(() => {
    document.title = 'Page2'
  })

  let { userInfo } = props.loginInfo

  return <Fragment>
    <h1>This is Page2</h1>
    <p>{ JSON.stringify(userInfo) }</p>
  </Fragment>
}

// lead stores in
const mapStateToProps = state => ({
	loginInfo: state.loginInfo
})

export default connect(mapStateToProps)(Page2)

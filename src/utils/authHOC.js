import React from 'react';
import { connect } from 'react-redux';
import actions from '@/store/actions';
import { bindActionCreators } from 'redux';
import { browserHistory} from '@/utils/browserHistory';
import { authRender } from '@/utils/authRender';

export default function authHOC(Component, path) {
	class Authenticated extends React.Component {
		constructor(props){
			super(props)
			this.state = {

			}
		}

		componentWillMount() {
      let { selfAuth, userInfo } = this.props
      let { logState } = userInfo
      if( !logState ) logState = cookies.get('ge_logState') === 'true' ? true : false

      if( !Object.keys(selfAuth).length ){
        let { Ajax } = this.props.actions
        Ajax({
          url: '/auth/queryAuth',
    			method: 'get',
    			sign: 'self_auth',
					success: res => {
            let hasAuthority = authRender(path, selfAuth)
      			!hasAuthority && browserHistory.push('/403')
          },
          fail: err => browserHistory.push('/403')
        })
      }
      else {
  			let hasAuthority = authRender(path, selfAuth)
  			!hasAuthority && browserHistory.push('/403')
      }
		}

		render(){
			let { selfAuth } = this.props
			let hasAuthority = authRender(path, selfAuth)
			return hasAuthority ? <Component /> : null
		}
	}

	const mapStateToProps = (state) => ({
		selfAuth: state.loginInfo['self_auth'],
    userInfo: state.loginInfo['userInfo']
	})

	const mapDispatchToProps = dispatch => ({ "actions": bindActionCreators(actions, dispatch)})

	return connect(mapStateToProps, mapDispatchToProps)(Authenticated)
}

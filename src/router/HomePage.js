import { Route, Switch, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '@/store/actions';
import Home from '@/views/home/Home';
import Page1 from '@/views/page/Page1';
import Page2 from '@/views/page/Page2';
import Page403 from '@/views/page/Page403';
import { authRender } from '@/utils/authRender';
import { copyAndRename } from '@/utils/deepCopy';

const HomePage = props => {
  const selfAuth = copyAndRename(props.selfAuth)

  return <Home>
    <Switch>
      { authRender('system:user:index', selfAuth) ? <Route path="/home/page1" component={ Page1 } /> : null }
      { authRender('system:user:add', selfAuth) ? <Route path="/home/page2" component={ Page2 } /> : null }
      <Route path="/home/403" component={ Page403 } />
      <Redirect to={ '/home/403' } />
    </Switch>
  </Home>
}

// lead stores in
const mapStateToProps = state => ({
	selfAuth: state.detailData['self_auth'] || {}
})

// lead actions in
const mapDispatchToProps = dispatch => ({ "actions": bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)

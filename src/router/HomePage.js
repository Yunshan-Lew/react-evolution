import { Route, Switch, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '@/store/actions';
import CommonLayout from '@/views/layout/CommonLayout';
import Page1 from '@/views/page/Page1';
import Page2 from '@/views/page/Page2';
import PageMain from '@/views/page/PageMain';
import { authRender } from '@/utils/authRender';
import { prepareAuth } from '@/utils/prepareAuth';

const HomePage = props => {
  let { selfAuth } = props

  return <CommonLayout>
    <Switch>
      { authRender('system:user:index', selfAuth) ? <Route path="/home/page1" component={ Page1 } /> : null }
      { authRender('system:user:add', selfAuth) ? <Route path="/home/page2" component={ Page2 } /> : null }
      <Route path="/home/main" component={ PageMain } />
      <Redirect to={ '/home/main' } />
    </Switch>
  </CommonLayout>
}

// lead stores in
const mapStateToProps = state => ({
	selfAuth: prepareAuth(state.detailData['self_auth'])
})

// lead actions in
const mapDispatchToProps = dispatch => ({ "actions": bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)

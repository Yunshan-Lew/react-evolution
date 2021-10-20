import { Route, Switch, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '@/store/actions';
import CommonLayout from '@/views/layout/CommonLayout';
import Page1 from '@/views/page/Page1';
import Page2 from '@/views/page/Page2';
import PageMain from '@/views/page/PageMain';
import PermissionRouter from '@/components/PermissionRouter'

const HomeRouter = props => {
  return <CommonLayout>
    <Switch>
      <PermissionRouter path="/home/page1" authSign="system:user:index" component={ Page1 } />
      <PermissionRouter path="/home/page2" authSign="system:department:index2" component={ Page2 } />
      <Route path="/home/main" component={ PageMain } />
      <Redirect to={ '/home/main' } />
    </Switch>
  </CommonLayout>
}

// lead stores in
const mapStateToProps = state => ({})

// lead actions in
const mapDispatchToProps = dispatch => ({ "actions": bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(HomeRouter)

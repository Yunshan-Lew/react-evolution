import { Switch, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '@/store/actions';
import CommonLayout from '@/views/layout/CommonLayout';
import UserIndex from '@/views/page/UserIndex';
import UserInfo from '@/views/page/UserInfo';
import Wait from '@/views/message/Wait';
import PageMain from '@/views/common/PageMain';
import PermissionRouter from '@/components/PermissionRouter'

const HomeRouter = props => {
  return <CommonLayout>
    <Switch>
      <PermissionRouter path="/home/user" authSign="system:user:index" component={ UserIndex } />
      <PermissionRouter path="/home/userinfo" authSign="system:department:index" component={ UserInfo } />
      <PermissionRouter path="/home/wait" authSign="work:board:wait" component={ Wait } />
      <PermissionRouter path="/home/main" component={ PageMain } />
      <Redirect to={ '/home/main' } />
    </Switch>
  </CommonLayout>
}

// lead stores in
const mapStateToProps = state => ({})

// lead actions in
const mapDispatchToProps = dispatch => ({ "actions": bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(HomeRouter)

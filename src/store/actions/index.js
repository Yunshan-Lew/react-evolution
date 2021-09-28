import { loginIn, loginOut } from './loginAction'
import { pushDetailData, pushListData } from './baseActions'
import Ajax from './Ajax'
import AjaxList from './AjaxList'
import { AjaxLogin, AjaxRelogin } from './AjaxLogin'

const actions = { Ajax, AjaxList, AjaxLogin, AjaxRelogin, loginIn, loginOut, pushDetailData, pushListData }

export default actions

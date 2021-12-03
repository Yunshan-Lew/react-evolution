import { loginIn, loginOut } from './loginAction'
import { pushDetailData, pushListData, pushSystemData, cleanPrevData } from './baseActions'
import { Ajax, AjaxFile } from './Ajax'
import { AjaxList } from './AjaxList'
import { AjaxSystem } from './AjaxSystem'
import { AjaxLogin, AjaxRelogin } from './AjaxLogin'

const actions = {
  Ajax, AjaxFile, AjaxList, AjaxSystem, AjaxLogin, AjaxRelogin,
  loginIn, loginOut,
  pushDetailData, pushListData, pushSystemData, cleanPrevData
}

export default actions

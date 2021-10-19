import fetch from 'isomorphic-fetch';
import cookies from 'browser-cookies';
import actions from '@/store/actions';
import configs from '@/config';
import { toQueryString } from '@/utils/toQueryString';
import { handleResponse } from '@/utils/handleResponse';

const SUCCESS = configs.status.success

function AjaxList(param){
	return function (dispatch, getState) {
		const { url, method, data, contentType, sign, success, fail } = param

		return fetch(`${ configs.THE_HOST }${ /^\//.test(url) ? '' : '/' }${ url }`, {
			method,
			headers: { "Content-Type": contentType || "application/x-www-form-urlencoded", "Authorization": cookies.get('tx_token') || '' },
			body: (method || 'GET').toUpperCase() === 'GET' ? null : contentType ? { "pageSize": configs.pageSize, ...data } : toQueryString({ "pageSize": configs.pageSize, ...data }),
			timeout: 20000
		})
		.then(handleResponse)
		.then(res => {
			let data = res.data || {}
			let { count, results } = data
			if( SUCCESS.includes(res.code) ){
				if( sign ) {
					dispatch(actions['pushListData'](sign, { "total": count, "list": results }))
				}
				if( typeof success === 'function' ) success(res)
			}
			else if( !SUCCESS.includes(res.code) && typeof fail === 'function' ){
				fail(res)
			}
		})
		.catch(error => {
			let code = error.code || null
      let data = { message: JSON.stringify(error, Object.getOwnPropertyNames(error), 2) }
      if ( code && code === 401 ) {
				dispatch(actions['loginOut']())
				window.location.href = '/login'
      }
      else {
        typeof fail === 'function' ? fail(data) : void(0)
      }
		})
	}
}

export default AjaxList

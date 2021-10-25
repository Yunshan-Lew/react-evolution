import fetch from 'isomorphic-fetch';
import cookies from 'browser-cookies';
import actions from '@/store/actions';
import configs from '@/config';
import { toQueryString } from '@/utils/toQueryString';
import { handleResponse } from '@/utils/handleResponse';

const SUCCESS = configs.status.success

function Ajax(param){
	return function (dispatch, getState) {
		const { url, method, data, contentType, sign, timeout, success, fail } = param

		return fetch(`${ configs.THE_HOST }${ /^\//.test(url) ? '' : '/' }${ url }${ (method || 'GET').toUpperCase() === 'GET' ? '?' + toQueryString(data) : '' }`, {
			method,
			headers: { "Content-Type": contentType || "application/x-www-form-urlencoded", "Authorization": cookies.get('tx_token') || '' },
			body: (method || 'GET').toUpperCase() === 'GET' ? null : contentType ? JSON.stringify(data) : toQueryString(data),
			timeout: timeout || 20000
		})
		.then(handleResponse)
		.then(res => {
			let { code, data } = res
			if( SUCCESS.includes(code) ){
				if( sign && typeof data !== 'undefined' && data !== null ) {
					dispatch(actions['pushDetailData'](sign, data))
				}
				if (typeof success === 'function') {
					success(res)
				}
			}
			else if( code && !SUCCESS.includes(code) && typeof fail === 'function' ){
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

export default Ajax

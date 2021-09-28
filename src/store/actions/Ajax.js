import fetch from 'isomorphic-fetch';
import cookies from 'browser-cookies';
import actions from '@/store/actions';
import configs from '@/config';
import toQueryString from '@/utils/toQueryString'

const SUCCESS = configs.status.success

function Ajax(param){
	return function (dispatch, getState) {
		const { url, method, data, contentType, sign, timeout, success, fail } = param

		return fetch(`${ configs.THE_HOST }${ /^\//.test(url) ? '' : '/' }url`, {
			method: method,
			headers: { "Content-Type": contentType || "application/x-www-form-urlencoded", "Authorization": cookies.get('token') || '' },
			body: !contentType ? toQueryString(data) : data,
			timeout: timeout || 20000
		})
		.then(res => res.json())
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
			let response = error.response || {}
      let status = response.status || null
      let data = response.data || { message: JSON.stringify(error, Object.getOwnPropertyNames(error), 2) }
      if ( status && status === 401 ) {
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

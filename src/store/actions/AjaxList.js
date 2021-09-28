import fetch from 'isomorphic-fetch';
import cookies from 'browser-cookies';
import actions from '@/store/actions';
import configs from '@/config';
import toQueryString from '@/utils/toQueryString';

const SUCCESS = configs.status.success

function AjaxList(param){
	return function (dispatch, getState) {

		const { url, method, data, contentType, sign, success, fail } = param

		return fetch(`${ configs.THE_HOST }${ /^\//.test(url) ? '' : '/' }url`, {
			method: method,
			headers: { "Content-Type": contentType || "application/x-www-form-urlencoded", "Authorization": cookies.get('token') || '' },
			body: !contentType ? toQueryString({ "pageSize": configs.pageSize, ...data }) : { "pageSize": configs.pageSize, ...data },
			timeout: 20000
		})
		.then(res => res.json())
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

export default AjaxList

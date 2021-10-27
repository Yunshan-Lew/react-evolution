import fetch from 'isomorphic-fetch';
import actions from '@/store/actions';
import configs from '@/config';
import { toQueryString } from '@/utils/toQueryString';
import { handleResponse } from '@/utils/handleResponse';
import cookies from 'browser-cookies';

const SUCCESS = configs.status.success

function AjaxLogin(param){
	return function (dispatch, getState) {
		const { data, success, fail } = param

		return fetch(`${ configs.THE_HOST }/auth/login`, {
			method: 'POST',
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: toQueryString(data),
			timeout: 20000
		})
		.then(handleResponse)
		.then(res => {
			if( SUCCESS.includes(res.code) ){
				dispatch(actions['loginIn'](res.data))
				if( typeof success === 'function' ) {
					success(res)
				}
			}
			else if( !SUCCESS.includes(res.code) && typeof fail === 'function' ){
				fail(res)
			}
		})
		.catch(error => {
			let data = { message: JSON.stringify(error, Object.getOwnPropertyNames(error), 2) }
      typeof fail === 'function' ? fail(data) : void(0)
		})
	}
}

function AjaxRelogin(param = {}){
	return function (dispatch, getState) {
		const { success, fail } = param

		return fetch(`${ configs.THE_HOST }/auth/getCurrentUser`, {
			method: 'GET',
			headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": cookies.get('tx_token') || '' },
			timeout: 20000
		})
		.then(handleResponse)
		.then(res => {
			if( SUCCESS.includes(res.code) ){
				dispatch(actions['loginIn']({ "user": res.data }))
				if( typeof success === 'function' ) {
					success(res)
				}
			}
			else if( !SUCCESS.includes(res.code) && typeof fail === 'function' ){
				fail(res)
			}
		})
		.catch(error => {
			let data = { message: JSON.stringify(error, Object.getOwnPropertyNames(error), 2) }
      typeof fail === 'function' ? fail(data) : void(0)
		})
	}
}

export { AjaxLogin, AjaxRelogin }

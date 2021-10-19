import cookies from 'browser-cookies'

const loginIn = (data) => {
	const { token, user } = data
	cookies.set('tx_logState', 'true', {
		expires: 7,
		path: '/'
	})
	cookies.set('tx_token', token, {
		expires: 7,
		path: '/'
	})
	return {
		type: 'LOGIN_IN',
		data: user
	}
}

const loginOut = () => {
	cookies.set('tx_logState', 'false', {
		expires: 7,
		path: '/'
	})
	return {
		type: 'LOGIN_OUT'
	}
}

export { loginIn, loginOut }

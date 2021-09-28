import cookies from 'browser-cookies'

const loginIn = (data) => {
	const { token, user } = data
	cookies.set('logState', 'true', {
		expires: 7,
		path: '/'
	})
	cookies.set('token', token, {
		expires: 7,
		path: '/'
	})
	return {
		type: 'LOGIN_IN',
		data: user
	}
}

const loginOut = () => {
	cookies.set('logState', 'false', {
		expires: 7,
		path: '/'
	})
	return {
		type: 'LOGIN_OUT'
	}
}

export { loginIn, loginOut }

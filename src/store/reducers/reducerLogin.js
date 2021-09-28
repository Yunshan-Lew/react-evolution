const defaultStore = {
	"userInfo": {
		"logState": false,
		"id": 0,
		"userName": "",
		"gender": 0,
		"headIcon": "",
		"mobile": "",
		"email": "",
		"comment": "",
		"creatorId": 0,
		"available": false,
		"createDate": "",
		"updateDate": "",
		"departments": [],
		"duties": [],
		"roles": []
	}
}

const todos = (state = defaultStore, { type, data }) => {
	switch (type) {
		case 'LOGIN_IN':
			return {
				...state,
				userInfo: {
					...data,
					logState: true
				}
			}
		case 'LOGIN_OUT':
			return {
				...state,
				userInfo: {
					...state['userInfo'],
					logState: false
				}
			}
		default:
			return state
	}
}

export default todos

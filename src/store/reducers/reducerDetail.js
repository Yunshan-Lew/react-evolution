const detailInfo = {
	self_auth: {},
	dept_options: [],
	duty_options: [],
	role_options: [],
	relation: 'default value'
}

const todos = (state = detailInfo, { type, data }) => {
	switch (type) {
		case 'self_auth':
			return {
				...state,
				self_auth: data
			}
		case 'dept_options':
			return {
				...state,
				dept_options: data
			}
		case 'duty_options':
			return {
				...state,
				duty_options: data
			}
		case 'role_options':
			return {
				...state,
				role_options: data
			}
		case 'relation':
			return {
				...state,
				relation: data
			}
		default:
			return state
	}
}

export default todos

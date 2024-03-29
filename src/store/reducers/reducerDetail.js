const detailInfo = {
	self_auth: {},
	relation: { value: 'default value' }
}

const todos = (state = detailInfo, { type, data, sign }) => {
	switch (type) {
		case 'self_auth':
			return {
				...state,
				self_auth: data
			}
		case 'relation':
			return {
				...state,
				relation: data
			}
		case 'clean':
			return {
				...state,
				[sign]: Array.isArray(state[sign]) ? [] : {}
			}
		default:
			return state
	}
}

export default todos

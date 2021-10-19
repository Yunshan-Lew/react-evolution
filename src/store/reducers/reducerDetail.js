const detailInfo = {
	self_auth: {},
	relation: 'default value'
}

const todos = (state = detailInfo, { type, data }) => {
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
		default:
			return state
	}
}

export default todos

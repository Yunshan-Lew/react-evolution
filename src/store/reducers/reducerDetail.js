const detailInfo = {
	relation: 'default value'
}

const todos = (state = detailInfo, { type, data }) => {
	switch (type) {
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

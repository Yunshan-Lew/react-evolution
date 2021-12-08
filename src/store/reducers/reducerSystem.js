const detailInfo = {
	dept_options: [],
	duty_options: [],
	role_options: [],
	process_nodes: []
}

const todos = (state = detailInfo, { type, data, sign }) => {
	switch (type) {
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
		case 'process_nodes':
			return {
				...state,
				process_nodes: data
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

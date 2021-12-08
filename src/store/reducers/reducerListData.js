const defaultStore = {
	system_user: {
		count: 0,
		results: []
	},
	todo_list: {
		count: 0,
		results: []
	}
}

function nullOrUndefined(v){
	return typeof v === 'undefined' || v === null
}

const todos = (state = defaultStore, { type, data }) => {
	if( type === 'system_user' ){
		const count = nullOrUndefined(data.count) ? state['system_user'].count : Number(data.count)
		const results = data.results || state['system_user'].results
		return { ...state, system_user: { count, results } }
	}
	else if( type === 'todo_list' ){
		const count = nullOrUndefined(data.count) ? state['todo_list'].count : Number(data.count)
		const results = data.results || state['todo_list'].results
		return { ...state, todo_list: { count, results } }
	}
	else {
		return state
	}
}

export default todos

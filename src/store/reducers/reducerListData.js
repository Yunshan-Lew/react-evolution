const defaultStore = {
	system_user: {
		count: 0,
		results: []
	},
	TRAIN: {
		count: 0,
		results: []
	},
	BILLORDER: {
		count: 0,
		results: []
	}
}

const todos = (state = defaultStore, { type, data }) => {
	if( type === 'system_user' ){
		const count = Number(data.count || state['system_user'].count)
		const results = data.results || state['system_user'].results
		return { ...state, system_user: { count, results } }
	}
	else if( type === 'TRAIN' ){
		const count = Number(data.count || state['TRAIN'].count)
		const results = data.results || state['TRAIN'].results
		return { ...state, TRAIN: { count, results } }
	}
	else if( type === 'BILLORDER' ){
		const count = Number(data.count || state['BILLORDER'].count)
		const results = data.results || state['BILLORDER'].results
		return { ...state, BILLORDER: { count, results } }
	}
	else {
		return state
	}
}

export default todos

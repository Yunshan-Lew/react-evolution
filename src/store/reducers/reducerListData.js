const defaultStore = {
	EMPLOYEE: {
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
	if( type === 'EMPLOYEE' ){
		const count = Number(data.count || state['EMPLOYEE'].count)
		const results = data.results || state['EMPLOYEE'].results
		return { ...state, EMPLOYEE: { count, results } }
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

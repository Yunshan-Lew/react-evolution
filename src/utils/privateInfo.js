const privateInfo = function(val){
	if( /^\d{11}$/.test(val) ){
		return `${ val.slice(0, 3) }****${ val.slice(7) }`
	}
	else if( /^[0-9X]{18}$/.test(val) ){
		return `${ val.slice(0, 6) }********${ val.slice(14) }`
	}
	else {
		return val || '--'
	}
}

export { privateInfo }

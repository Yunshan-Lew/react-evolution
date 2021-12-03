const pushDetailData = (sign, data) => {
	return {
		type: sign,
		data: data
	}
}

const pushListData = (sign, data) => {
	return {
		type: sign,
		data: data
	}
}

const pushSystemData = (sign, data) => {
	return {
		type: sign,
		data: data
	}
}

const cleanPrevData = sign => ({ type: 'clean', sign })

export { pushDetailData, pushListData, pushSystemData, cleanPrevData }

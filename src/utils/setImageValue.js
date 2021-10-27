const setImageValue = fileList => {
	return Array.isArray(fileList) ? fileList.map(item => {
		const { response } = item
		if ( response ) {
			if ( response.code === 0 && Array.isArray(response.data) && response.data.length ) {
				return response.data[0]['id']
			}
			else {
				return false
			}
		}
		else {
			return item.uid
		}
	}).filter(item => !!item).join(",") : ""
}

const setPicReturn = url => {
	return Array.isArray(url) ? url.map((item, index) => ({
			uid: index,
			name: index,
			status: 'done',
			url: item
		})
	) : [{
		uid: url || 1,
		name: url || 1,
		status: 'done',
		url
	}]
}

export { setImageValue, setPicReturn }

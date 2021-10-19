// 对象深拷贝
const deepCopy = function(obj){
	if( typeof obj == 'undefined' || obj == null ) return obj
	let result = Array.isArray(obj) ? [] : {}
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			if (typeof obj[key] === 'object') {
				result[key] = deepCopy(obj[key])
			} else {
				result[key] = obj[key]
			}
		}
	}
	return result
}

// 权限数据深拷贝 + 键值降维
const copyAndRename = function(obj){
	let result = {}
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			let newKey = key.split(':').pop()
			if (typeof obj[key] === 'object') {
				result[newKey] = copyAndRename(obj[key])
			} else {
				result[newKey] = obj[key]
			}
		}
	}
	return result
}

// 两个对象内容是否相等
const isObjectEqual = function (a, b) {
	if( !a || !b ) return false
	let aProps = Object.keys(a)
  let bProps = Object.keys(b)
  if (aProps.length !== bProps.length) {
		return false
  }
  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i]
		let propA = a[propName]
    let propB = b[propName]
    if (typeof propA == 'object' && propA !== null && typeof propB == 'object' && propB !== null) {
      if( !isObjectEqual(propA, propB) ) return false
    }
		else if (propA !== propB) {
			return false
    }
  }
  return true
}

export { deepCopy, copyAndRename, isObjectEqual }

/*
	输入权限标示、权限数据，返回true/false
	示例：
	单例模式-authRender('A', authData)
	多例模式-authRender(['A', 'B'], authData) // 等同于A || B
*/
const authRender = function(sign, obj){
	if( typeof sign !== 'string' && !Array.isArray(sign) ) return false
	if( !sign.length || typeof obj !== 'object' ) return false

	if( typeof sign == 'string' ){
		let signList = sign.split(':'),
		keyName = signList[0]
		if( obj[keyName] ){
			if( signList.length > 1 ){
				signList.shift()
				let nextSign = signList.join(':')
				return authRender(nextSign, obj[keyName])
			}
			else {
				return true
			}
		}
		else {
			return false
		}
	}
	else if( Array.isArray(sign) ){
		return sign.some(item => authRender(item, obj))
	}
}

export { authRender }

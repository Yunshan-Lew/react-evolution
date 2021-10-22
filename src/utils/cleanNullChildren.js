const cleanNullChildren = function(options, keyName){
  if( !Array.isArray(options) || typeof keyName !== 'string' ) return []
  let result = options.map(item => {
    if( !item[keyName] ) return item
    if( Array.isArray(item[keyName]) ){
      if( item[keyName].length ){
        return { ...item, [keyName]: cleanNullChildren(item[keyName], keyName) }
      }
      else {
        delete item[keyName]
        return item
      }
    }
    else {
      delete item[keyName]
      return item
    }
  })
  return result
}
export { cleanNullChildren }

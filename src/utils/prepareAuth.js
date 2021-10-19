import { copyAndRename } from '@/utils/deepCopy';

const prepareAuth = function(auth){
  let authData = Object.keys(auth || {}).length ? auth : JSON.parse(localStorage.getItem('tx_self_auth') || '{}')
  return copyAndRename(authData)
}

export { prepareAuth }

const handleResponse = response => {
  return response.json()
  .then(json => {
    if( response.ok ){
      return json
    }
    else {
      return Promise.reject(json)
    }
  })
}

export { handleResponse }

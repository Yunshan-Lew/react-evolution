const toQueryString = function (obj) {
    return obj ? Object.keys(obj).sort().map(function (key) {
        const val = obj[key];
        if (Array.isArray(val)) {
            return val.sort().map(function (val2) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
            }).join('&');
        }
        return encodeURIComponent(key) + '=' + encodeURIComponent(val);
    }).join('&') : '';
}

const parseQueryString = function(){
  let query = {};
	window.location.search.replace(/^\?/, '').split('&').forEach(item => {
		let keyVal = item.split('=');
		if( keyVal.length === 2 ) query[keyVal[0]] = keyVal[1];
	});
  return query;
}

export { toQueryString, parseQueryString }

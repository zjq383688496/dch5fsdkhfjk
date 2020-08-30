const { message } = require('antd')

function remote(url, config = {}) {
	return new Promise((resolve, reject) => {
		var newConfig = Object.assign({ method: 'GET' }, config)
		fetch(url, newConfig).then(response => response.json()).then(result => {
			let { data, code, message: msg } = result
			if (code === '0') {
				resolve(data)
			} else {
				message.error(msg)
				if (code === 1 && !/^\/login/.test(location.pathname)) {
					window.__User__ = null
					window.__History__ && window.__History__.push('/login')
				}
				reject(msg)
			}
		}).catch(error => {
			message.error(error.message)
			reject(error)
		})
	})
}

module.exports = {
	get: (url, query = {}) => {
		var queryArr = []
		Object.keys(query).forEach(key => queryArr.push(`${key}=${query[key]}`))
		if (queryArr.length) url += ((/\?/.test(url)? '&': '?') + queryArr.join('&'))
		return remote(url)
	},
	post: (url, config = {}) => {
		return remote(url, {
			method: 'POST',
			body: new URLSearchParams(config),
		})
	},
	postJSON: (url, config = {}) => {
		return remote(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(config),
			credentials: 'include'
		})
	},
}
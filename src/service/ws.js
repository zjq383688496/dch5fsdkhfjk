var { data2cache, cache2device } = require('@cache')
// var mock = require('./mock')

// var timeout = null
function WS() {
	let urlWs    = __URL__.getWSUrl(10),
		urlStart = __URL__.getWSStart(10),
		urlStop  = __URL__.getWSStop(10)
	let socket = window._ws = new WebSocket(urlWs)
	socket.onopen = function() {
		fetch(urlStart)
		// socket.send('')
		// sendMessage(socket)
		cache2device(__Interval__)
		// setTimeout(_ => {
		// 	fetch(urlStop)
		// }, 2e4)
	}
	// if (message) socket.onmessage = message
	socket.onmessage = function({ data }) {
		if (!/^{/.test(data)) return
		let da = JSON.parse(data)
		// let mt = data.match(/^客户端：(.*),已收到$/)
		// if (!mt || !mt[1]) return
		// let da = JSON.parse(mt[1])
		// console.log(da)
		// console.log(da)
		data2cache(da)
	}
	socket.onclose = function(e) {
		console.log('WebSocket is closed now.')
		// close && close(e)
	}
	socket.onerror = function(e) {
		console.error('WebSocket error observed: ', e)
		// error && error(e)
	}
	return socket
}

function sendMessage(socket) {
	timeout = setInterval(() => {
		let da = JSON.stringify(mock(4))
		socket.send(da)
	}, 1000)
	// setTimeout(() => {
	// 	clearInterval(timeout)
	// }, 4100)
}
module.exports = WS



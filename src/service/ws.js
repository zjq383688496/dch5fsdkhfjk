var { data2cache, cache2device } = require('@cache')

var mmm
var getmmm = function() {
	let da = deepCopy(mmm)
	da.realTimeConfigurationList.map(_ => {
		let { minValue, maxValue } = _
		_.minValue = minValue * randomRange(1, 2, 2)
		_.maxValue = maxValue * randomRange(1, 2, 2)
	})
	return da
}

function WS() {
	let { id } = __User__
	let urlWs  = __URL__.getWSUrl(id)
	let socket = window._ws = new WebSocket(urlWs)
	socket.onopen = function() {
		cache2device(__Interval__)
	}
	socket.onmessage = function({ data }) {
		if (!/^{/.test(data)) return
		let da = JSON.parse(data)
		data2cache(da)
		console.log(data)
		console.log('-----------------')
		// if (da.packageCode === 'REAL_TIME_CONFIGURATION') {
		// 	console.log(JSON.stringify(da))
		// 	mmm = da
		// }
		// if (randomRange(0, 1)) {
		// 	data2cache(getmmm())
		// }
	}
	socket.onclose = function(e) {
		console.log('WebSocket is closed now.')
		reconnect()
	}
	socket.onerror = function(e) {
		console.error('WebSocket error observed: ', e)
		reconnect()
	}
	return socket
}

// 重连
function reconnect() {
	// 没连接上会一直重连，设置延迟避免请求过多
	setTimeout(function () {
		WS()
	}, 2000)
}

module.exports = WS



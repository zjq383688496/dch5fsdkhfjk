module.exports = Object.assign(window, {
	__Redux__: {
		CurDevice: null,	// 当前设备
		// 设备数据
		Devices: [],
		Cache: {
			group: []
		}
	},
	__URL__: {
		getWSUrl(userId) {
			return `ws://94.191.50.139:8089/webSocket/${userId}`
		},
		getWSStart(userId) {
			// return `http://94.191.50.139:8089/experiment/start/${userId}`
			return `http://94.191.50.139:8089/experiment/simulate/${userId}`
			// return `/experiment/simulate/${userId}`
		},
		getWSStop() {
			// return `http://94.191.50.139:8089/experiment/stop/${userId}`
			return `http://94.191.50.139:8089/experiment/simulate/stop`
			// return `/experiment/simulate/stop`
		}
	}
})
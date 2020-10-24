module.exports = Object.assign(window, {
	__Interval__: 100,	// 160
	__TimeInterval__: null,
	__Null__: { value: null },
	__User__: null,
	__Grid__: [],
	__GridMap__:   {},		// 设备布局映射
	__GridIndex__: {},		// 设备布局索引
	__DeviceKey__: {},		// 设备对应的key数
	__BedName__: [],		// 床位名
	__MIN__:  {},			// 最小数据保存
	__MIN_STATE__: false,	// 最小数据不可用
	__SOCKET__: null,		// ws服务
	__VisibilityState__: '',	// 标签状态
	__Redux__: {
		CurDevice: null,	// 当前设备
		// 设备数据
		Devices: {},
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
	},
	__ReduxInit__() {
		window.__Redux__ = {
			CurDevice: null,
			// 设备数据
			Devices: {},
			Cache: {
				group: []
			}
		}
	},
	getAlarm(alarm) {
		let cls     = 'alarm_0',
			content = ''
		if (alarm){
			cls     = `alarm_${alarm.priority}`
			content = alarm.alarmmPhrase
		}
		return { cls, content }
	},
	// 获取图表分割数据(s)
	getChartsSplit(limit, split = 50, div = 10) {
		return new Array(limit).fill().map((_, i) => {
			if (!i) return 0
			if (i === limit.length - 1) return limit / div
			let num = Math.ceil(i / 10)
			return num + 's'
		})
	},
	// 获取图表分割数据的可见索引
	getChartsInterval(limit = 0, split = 50) {
		let num = ~~(limit / split),
			obj = {}
		new Array(num + 1).fill().forEach((_, i) => {
			let x = i * 50
			if (i == num) x -= 1
			obj[x] = true
		})
		return obj
	}
})
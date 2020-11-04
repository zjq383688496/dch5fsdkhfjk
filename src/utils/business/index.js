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
			return `ws://${window._BaseUrl_}/webSocket/${userId}`
		},
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
	getIE(data) {
		let { IEIN: I, IEOUT: E } = data
		if (I === undefined || E === undefined) return
		let min = Math.min(I, E)
		let NI  = I / min
		let NE  = E / min
		let IStr = parseInt(NI) === NI? NI: NI.toFixed(1),
			EStr = parseInt(NE) === NE? NE: NE.toFixed(1)

		return `${IStr}:${EStr}`
	},

	/* Echarts */
	// 获取图表分割数据(s)
	getChartsSplit(limit, split = 50, div = 10) {
		let arr = new Array(limit).fill().map((_, i) => {
			if (!i) return 0
			let num = Math.ceil(i / div)
			if (i > limit - 3) return num + 's'
			return num
		})
		// console.clear()
		// console.log(arr)
		return arr
	},
	// 获取图表分割数据的可见索引
	getChartsTickInterval(limit = 0, lastShow = true, split = 50) {
		let num = ~~(limit / split),
			obj = {}
		new Array(num + 1).fill().forEach((_, i) => {
			let x = i * 50
			if (lastShow && i == num) x -= 1
			obj[x] = true
		})
		return function(index) {
			return obj[index]
		}
	},
	getChartsTickIntervalY(min, max) {
		let obj = {}
		obj[min] = true
		obj[max] = true
		obj[0]   = true
		console.clear()
		console.log(obj)
		return function(index) {
			return obj[index]
		}
	},
	getChartsLabelInterval(limit = 0) {
		let num = ~~(limit / split),
			obj = {}
		new Array(num + 1).fill().forEach((_, i) => {
			let x = i * 50
			if (i == num) x -= 1
			obj[x] = true
		})
		return function(index) {
			return obj[index]
		}
	},
	// 获取最小值
	getMinValue(minValue, key) {
		if (key === 'VOLUME' || key === 'PAW') return 0
		return minValue || 0
	},
	getMaxValue(maxValue) {
		return maxValue || 100
	},
	getInterval(min, max, key) {
		if (key != 'FLOW') return max / 2
		// let val = Math.min(Math.abs(min), max)
		// console.log(val)
		return 10000
	},
	createXAxis(limit) {
		let data = getChartsSplit(limit)
		return [
			{
				type: 'category',
			},
			{
				data,
				position: 'bottom',
				axisLine: {
					lineStyle: {
						width: 1,
						type: 'dashed'
					}
				},
				axisTick: {
					interval: getChartsTickInterval(limit, false),
					length: 8,
				},
				axisLabel: {
					interval: getChartsTickInterval(limit),
					verticalAlign: 'top',
					textStyle: {
						fontSize: 12
					}
				},
			},
		]
	}
})
let _interval = null

let isInit = true

const limitVal = {
	o: {
		CO2:    {minValue: 0.0, maxValue: 0.0},
		VOLUME: {minValue: 0.0, maxValue: 16.818181818181817},
		FLOW:   {minValue: 16.704545454545453, maxValue: 289.4318181818182},
		PAW:    {minValue: 18.181818181818183, maxValue: 219.3181818181818},
	},
	n: {
		CO2:    {minValue: 0.0, maxValue: 0.0},
		VOLUME: {minValue: -3.3636363636363633, maxValue: 20.18181818181818},
		FLOW:   {minValue: -37.8409090909091, maxValue: 343.97727272727275},
		PAW:    {minValue: -22.045454545454543, maxValue: 259.54545454545456},
	}
}
Object.keys(limitVal.o).forEach(key => {
	let val = limitVal.o[key]
	val.minValue = Math.ceil(val.minValue)
	val.maxValue = Math.ceil(val.maxValue)
})
Object.keys(limitVal.n).forEach(key => {
	let val = limitVal.n[key]
	val.minValue = Math.ceil(val.minValue)
	val.maxValue = Math.ceil(val.maxValue)
})

// 缓存等待时间
let cacheWait = {
	CO2:    false,
	FLOW:   false,
	PAW:    false,
	VOLUME: false,
}

let realTimeBase = {
	PAW:    {},
	FLOW:   {},
	VOLUME: {},
}
let realTimeMax = {
	PAW:    '',
	FLOW:   '',
	VOLUME: '',
}

// 数据 存入 缓存
export function data2cache(data) {
	let { Cache } = window.__Redux__
	let { group } = Cache

	let { device, packageCode } = data
	if (!device) {
		// device = {
		// 	id: 1,
		// 	name: "V300",
		// 	no: "5002",
		// 	revision: "02.51:04.0",
		// }
		return// console.log(packageCode)
	}
	let { id, name, no, revision } = device,
		analysisFun = d2c[packageCode]

	if (id === 5001) {
		device.username = 'Trump'
	}
	if (id === 5002) {
		device.username = 'Donald'
	}


	if (!analysisFun) return// console.log(packageCode)

	if (!Cache[id]) Cache[id] = { alarm: {}, queues: {}, measure: {}, config: {}, device, deviceId: id }
	let cache = Cache[id]

	analysisFun(data, cache)

	if (!new Set(group).has(id)) group.push(id)

	// let { data = [] } = global_data
	// _data2cache(data, Cache)
	ReduxUpdate({})
}

// 缓存 进入 渲染
export function cache2device(time = 100) {
	let { Cache, Devices } = window.__Redux__
	// clearInterval(_interval)
	// _interval = setTimeout(() => {
	setTimeout(() => {
		_interval = setInterval(() => {
			let { group = [] } = Cache
			group.forEach((id, i) => {
				if (!Devices[i]) Devices[i]   = {}
				if (!__Base__[id]) __Base__[id] = {}
				if (!__MAX__[id])  __MAX__[id]  = {}
				let Base   = __Base__[id]
				let MAX    = __MAX__[id]
				let Device = Devices[i]
				let cache  = Cache[id],
					{ alarm, config, device, deviceId, measure, queues } = cache,
					realTime   = {}

				// 遍历波形数据队列
				Object.keys(queues).forEach(key => {
					let queue = queues[key],
						len   = queue.length,
						wait  = cacheWait[key]

					if (len >= 60) {
						queue.splice(0, len - 30)
					}

					let value = queue[0]
					realTime[key] = !wait? { value }: __Null__ 
					// realTime[key] = queue.shift() || null

					// 触发等待
					if (!len) {
						cacheWait[key] = true
					}
					if (len >= 30) {
						cacheWait[key] = false
					}
				})

				let nowLen = Object.values(realTime).length,
					newLen = Object.values(realTime).filter(({ value }) => value != null).length
				
				if (nowLen === 4 && newLen === 4) {
					Object.keys(queues).forEach(key => {
						let val = queues[key].shift()

						// 获取波形基数
						if (MAX[key]) return
						if (!Base[key]) Base[key] = {}
						let max = Base[key]
						if (!max) return
						// if (key != 'FLOW') return
						if (!max[val]) max[val] = 0
						++max[val]
						let mv = 0, mk = ''
						// console.log(val)
						Object.keys(max).forEach(k => {
							let v = max[k]
							if (v > mv) {
								mv = v
								mk = k
							}
						})
						if (mv > 16) {
							let MX = MAX[key] = {}
							MX[mk] = true
							MX[0]  = true
							Base[key] = {}
						}
						// console.log(`${key} maxValue: `, mk, mv)
					})
				} else {
					console.log('数据异常: ', JSON.stringify(realTime))
					realTime = {
						PAW:    __Null__,
						FLOW:   __Null__,
						VOLUME: __Null__,
						CO2:    __Null__,
					}
				}

				// console.clear()
				// console.log(queues)
				// console.log(Object.values(alarm))
				Object.assign(Device, {
					// alarm: alarm.map(_ => _.message),
					alarm: Object.values(alarm).map(_ => _.message),
					config,
					device,
					deviceId,
					measure,
					realTime,
				})
			})
		}, time)
	}, 3000)
}

const d2c = {
	// TEXT_MESSAGE({ device }) {
	// 	let { id, name, no, revision } = device
	// },
	// DEVICE_SETTING({ device }) {
	// 	let { id, name, no, revision } = device
	// },
	// DEVICE_IDENTIFICATION({ device }) {
	// 	let { id, name, no, revision } = device
	// },
	// 波形配置
	REAL_TIME_CONFIGURATION(data, { config }) {
		let { packageCode, realTimeConfigurationList } = data
		if (!realTimeConfigurationList || !realTimeConfigurationList.length) return

		realTimeConfigurationList.forEach(realTimeConfiguration => {
			let { code, minValue, maxValue } = realTimeConfiguration,
				key = code.replace(`${packageCode}_`, '')
				// key = code.replace(`REAL_TIME_DATA_`, '')

			// 数据极限值替换
			// debugger
			Object.assign(realTimeConfiguration, {
				minValue: Math.ceil(minValue),
				maxValue: Math.ceil(maxValue)
			})
			// Object.assign(realTimeConfiguration, limitVal.n[key])

			config[key] = realTimeConfiguration
		})
	},
	// 波形数据
	REAL_TIME_DATA(data, { queues }) {
		let { packageCode, realTimeDataList } = data

		realTimeDataList.forEach(realTime => {
			// let multiple = 1
			let { code, value } = realTime,
				key = code.replace(`${packageCode}_`, '')
			
			// if (key === 'PAW') multiple = .4
			// value *= multiple

			if (!queues[key]) queues[key] = []

			let queue = queues[key]
			// queue.push(Math.ceil(value))
			queue.push(+(value).toFixed(4))
		})
	},
	// 观测值
	MEASURED_DATA_P1(data, cache) {
		measureFun(data, cache)
	},
	MEASURED_DATA_P2(data, cache) {
		measureFun(data, cache)
	},
	// 告警
	DEVICE_ALARM_P1(data, cache) {
		alarmFun(data, cache)
	},
	DEVICE_ALARM_P2(data, cache) {
		alarmFun(data, cache)
	}
}
// 告警通用方法
function alarmFun(data, cache) {
	let { packageCode, deviceAlarmList } = data
	let { alarm } = cache
	deviceAlarmList.forEach(deviceAlarm => {
		let { priority, alarmmPhrase } = deviceAlarm
		let message = alarmmPhrase.replace(/(^\s+|\s+$)/g, '')
		let key = `${priority}_${message}`
		alarm[key] = { priority, message, timestamp: Date.now() }
		// alarm.push({ priority, message: alarmmPhrase, timestamp: Date.now() })
	})
	alarmExpire(alarm)
	cache.alarm = alarmSort(alarm)
	// alarm = cache.alarm = alarm.slice(0, 4)

}
// 告警过期
function alarmExpire(alarm) {
	Object.keys(alarm).forEach(key => {
		let { timestamp } = alarm[key],
			timeDiff = Date.now() - timestamp
		if (timeDiff > 3e3) {
			// console.log('时间差', timeDiff, key)
			delete alarm[key]
		}
	})
}
// 告警排序
function alarmSort(alarm) {
	let newAlarm = {}
	let sortArr = Object.keys(alarm).sort((key1, key2) => {
		let alarm1 = alarm[key1],
			alarm2 = alarm[key2],
			p1     = alarm1.priority,
			p2     = alarm2.priority,
			pDiff  = p1 - p2

		if (pDiff) return pDiff
		alarm1.timestamp - alarm2.timestamp
	})
	sortArr.forEach((key, i) => {
		if (i > 3) return
		alarm[key].idx = i
		newAlarm[key] = alarm[key]
	})
	return newAlarm
}

// 观测值通用方法
function measureFun(data, { measure }) {
	let { packageCode, measureDataList } = data
	measureDataList.forEach(measureData => {
		let { code, value } = measureData
		if (/UNKNOWN/i.test(code)) return
		let key = code.replace(`${packageCode}_`, '')
		measure[key] = value
	})
}


// 更新全局数据
function ReduxUpdate(o = {}) {
	Object.assign(window.__Redux__, o)
}
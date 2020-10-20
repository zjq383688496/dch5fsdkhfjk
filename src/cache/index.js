// 缓存等待时间
let cacheWait = {
	CO2:    false,
	FLOW:   false,
	PAW:    false,
	VOLUME: false,
}

let { abs, round } = Math
let limit = 30		// 最大缓存量

// 数据 存入 缓存
export function data2cache(data) {
	let { Cache } = window.__Redux__
	let { group } = Cache

	let { device, packageCode } = data
	if (!device) return// console.log(packageCode)

	let { id } = device,
		analysisFun = d2c[packageCode]

	if (!analysisFun) return// console.log(packageCode)

	if (!__GridIndex__[id]) return
	device = __GridIndex__[id]

	if (!Cache[id]) Cache[id] = { alarm: {}, queues: {}, measure: {}, config: {}, device, deviceId: id }
	let cache = Cache[id]

	analysisFun(data, cache)

	if (!new Set(group).has(id)) group.push(id)

	ReduxUpdate({})
}

// 缓存 进入 渲染
export async function cache2device(time = 100) {
	let { Cache, Devices } = window.__Redux__
	await _wait(2000)
	deviceKeyVaild()
	// let now = Date.now()
	clearInterval(__TimeInterval__)
	__TimeInterval__ = setInterval(() => {
		// console.log('开始耗时: ', Date.now() - now, 's')
		// now = Date.now()
		let { group = [] } = Cache
		group.forEach((id, i) => {
			if (!Devices[id]) Devices[id] = {}
			if (!__MIN__[id]) __MIN__[id] = {}

			let MIN    = __MIN__[id]
			let Device = Devices[id]
			let cache  = Cache[id],
				{ alarm, config, device, deviceId, measure, queues, textMessage } = cache,
				realTime = {}

			// 遍历波形数据队列
			Object.keys(queues).forEach(key => {
				let queue = queues[key],
					len   = queue.length,
					wait  = cacheWait[key]

				// 数据量大于缓存数2倍的时候清除多余数据
				if (__VisibilityState__ === 'hidden' && len > limit) {
					console.log(`1当前数据量已达: ${len}, 清除${len - limit}条数据!`)
					queue.splice(0, limit)
				}
				if (len > limit * 2) {
					console.log(`2当前数据量已达: ${len}, 清除${len - limit * 2}条数据!`)
					queue.splice(0, limit)
				}

				let value = queue[0]
				realTime[key] = !wait? { value }: __Null__
				// 触发等待
				if (!len)         cacheWait[key] = true
				if (len >= limit) cacheWait[key] = false
			})

			// let nowLen = Object.values(realTime).length,
			// 	newLen = Object.values(realTime).filter(({ value }) => value != null).length
			
			// if (!newLen) {
			// 	consoleLog()
			// 	console.log(queues, JSON.stringify(queues))
			// }

			if (__VisibilityState__ === 'hidden') {
				realTime = {
					PAW:    __Null__,
					FLOW:   __Null__,
					VOLUME: __Null__,
					CO2:    __Null__,
				}
			}

			Object.keys(queues).forEach(key => {
				let queue = queues[key]
				let wait  = cacheWait[key]
				let val   = queue[0]
				if (!wait) val = queue.shift()
				val = round(val)
				// 获取波形基数
				if (__MIN_STATE__) return
				if (MIN[key] === undefined) {
					MIN[key] = val
				} else {
					let MX  = abs(MIN[key]),
						VAL = abs(val)
					if (VAL < MX) MIN[key] = val
				}
			})

			Object.assign(Device, {
				alarm: Object.values(alarm).map(_ => _.message),
				config,
				device,
				deviceId,
				measure,
				realTime,
				textMessage,
			})
		})
		// console.log('执行耗时: ', Date.now() - now, 's')
	}, time)
	await _wait(5300)
	__MIN_STATE__ = true
}

function deviceKeyVaild() {
	let { Cache } = window.__Redux__
	let { group = [] } = Cache
	group.forEach((id, i) => {
		if (!__DeviceKey__[id]) __DeviceKey__[id] = {}
		let device = __DeviceKey__[id],
			cache  = Cache[id],
			{ queues } = cache
		Object.keys(queues).map(key => {
			device[key] = true
		})
	})
}

const d2c = {
	TEXT_MESSAGE(data, cache) {
		let { textMessageData } = data
		cache.textMessage = textMessageData.value
	},
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

			// 数据极限值替换
			Object.assign(realTimeConfiguration, {
				minValue: Math.ceil(minValue),
				maxValue: Math.ceil(maxValue),
			})

			// console.log(realTimeConfiguration)

			config[key] = realTimeConfiguration
		})
	},
	// 波形数据
	REAL_TIME_DATA(data, { queues }) {
		let { packageCode, realTimeDataList } = data

		realTimeDataList.forEach(realTime => {
			let { code, value } = realTime,
				key = code.replace(`${packageCode}_`, '')

			if (!queues[key]) queues[key] = []
			let queue = queues[key]
			queue.push(+(value).toFixed(4))
		})

		//
		// consoleLog()
		// let key = Object.keys(queues)[0]
		// let queue = queues[key]
		// console.log('length: ', queue.length)
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
	},
	DEVICE_ALARM_P3(data, cache) {
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
	console.log(cache.alarm)
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
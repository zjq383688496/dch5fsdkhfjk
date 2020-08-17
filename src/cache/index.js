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

	if (!analysisFun) return// console.log(packageCode)

	if (!Cache[id]) Cache[id] = { alarm: [], queues: {}, measure: {}, config: {}, device, deviceId: id }
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
				if (!Devices[i]) Devices[i] = {}
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

					realTime[key] = !wait? { value: queue.shift() }: __Null__ 
					// realTime[key] = queue.shift() || null

					// 触发等待
					if (!len) {
						cacheWait[key] = true
					}
					if (len >= 30) {
						cacheWait[key] = false
					}
				})

				// console.clear()
				// console.log(queues)

				Object.assign(Device, {
					alarm: alarm.map(_ => _.message),
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

/* 数据缓存 */
// function _data2cache(data, Cache) {
	
// 	data.forEach(device => {
// 		let { deviceId, deviceNo, userName, bedNo, attribute, area, series = [] } = device
// 		if (!Cache[deviceId]) Cache[deviceId] = { queues: [], index: {} }
// 		let cache = Cache[deviceId],
// 			{ index, lastId, queues } = cache,
// 			len = queues.length
// 		Object.assign(cache, {
// 			deviceId,
// 			deviceNo,
// 			userName,
// 			bedNo,
// 			attribute,
// 			area,
// 		})
// 		let last = series[series.length - 1]
// 		queues.push(...series)
// 		cache.lastId = last.id
// 		series.forEach(_ => index[_.id] = true)
// 		if (!new Set(group).has(deviceId)) group.push(deviceId)
// 	})
// }

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
			let { code } = realTimeConfiguration,
				key = code.replace(`${packageCode}_`, '')

			limitVal.n[key]
			Object.assign(realTimeConfiguration, limitVal.n[key])

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
			queue.push(Math.ceil(value))
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
		alarm.push({ priority, message: alarmmPhrase })
	})
	alarm = alarmUnique(alarm)
	alarm = alarmSort(alarm)
	alarm = cache.alarm = alarm.slice(0, 4)

}

// 告警去重
function alarmUnique(arr = []) {
	let strArr = arr.map(_ => JSON.stringify(_)),
		newArr = Array.from(new Set(strArr))
	return newArr.map(_ => JSON.parse(_))
}
// 告警排序
function alarmSort(arr = []) {
	return arr.sort((a, b) => {
		let priority = a.priority - b.priority
		if (priority) return priority
		return a.message.localeCompare(b.message)
	})
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
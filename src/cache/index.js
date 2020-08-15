let _interval = null

let isInit = true

// 数据 存入 缓存
export function data2cache(data) {
	let { Cache } = window.__Redux__
	let { group } = Cache

	let { device, packageCode } = data,
		{ id, name, no, revision } = device,
		analysisFun = d2c[packageCode]

	if (!analysisFun) return// console.log(packageCode)

	if (!Cache[id]) Cache[id] = { queues: {}, measure: {}, config: {}, device, deviceId: id }
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
					{ config, device, deviceId, measure, queues } = cache,
					realTime   = {}

				// 遍历波形数据队列
				Object.keys(queues).forEach(key => {
					let queue = queues[key],
						len   = queue.length

					if (len >= 60) {
						queue.splice(0, len - 30)
					}

					realTime[key] = queue.shift() || null
				})

				Object.assign(Device, {
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
			queue.push(value)
		})
	},
	// 观测值
	MEASURED_DATA_P1(data, cache) {
		measureFun(data, cache)
	},
	MEASURED_DATA_P2(data, cache) {
		measureFun(data, cache)
	}
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
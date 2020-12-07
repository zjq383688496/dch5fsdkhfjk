import * as ring from './ring'
import { WS } from '@service'

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

	if (!Cache[id]) Cache[id] = { clearRef: {}, clear: {}, alarm: [], pef: {}, pif: {}, queues: {}, measure: {}, volume: {}, config: {}, device, deviceId: id }
	let cache = Cache[id]

	analysisFun(data, cache, id)

	if (!new Set(group).has(id)) group.push(id)

	// ReduxUpdate({})
}

// 缓存 进入 渲染
export async function cache2device(time = 100) {
	let { Cache, Devices } = window.__Redux__
	await _wait(2000)
	deviceKeyVaild()
	clearInterval(__TimeInterval__)
	__TimeInterval__ = setInterval(() => {
		let { group = [] } = Cache
		group.forEach((id, i) => {
			if (!Devices[id]) Devices[id] = {}

			let Device = Devices[id]
			let cache  = Cache[id],
				{ alarm, clear, config, device, deviceId, measure, pif, pef, queues, textMessage } = cache,
				realTime = {}

			let newTime
			// 遍历波形数据队列
			Object.keys(queues).forEach(key => {
				let queue = queues[key],
					len   = queue.length,
					wait  = cacheWait[key]
				if (!len) return

				// 数据量大于缓存数2倍的时候清除多余数据
				if (__VisibilityState__ === 'hidden' && len > limit) {
					console.log(id, `恢复 - 当前数据量已达: ${len}, 清除${len - limit}条数据!`)
					queue = queues[key] = queue.slice(len - limit)
				}
				if (len > limit * 10) {
					queue = queues[key] = queue.slice(len - limit)
					console.log(id, `超量 - 当前数据量已达: ${len}, 清除${len - limit}条数据!`, queue.length)
				}

				let value = queue[0]

				if (!newTime) newTime = value.timestamp

				realTime[key] = !wait && value? { value: value.value }: __Null__
				// 触发等待
				if (!len)         cacheWait[key] = true
				if (len >= limit) cacheWait[key] = false
			})

			/* 抹平数据 开始 */
			// 检测判断是否抹平数据
			/*let fieldLen = Object.keys(queues).length,
				isSmooth = true,	// 是否需要抹平
				nullLen  = false,	// length是否为空
				timeMap  = {}		// 时间戳索引

			Object.keys(queues).forEach(key => {
				let queue = queues[key],
					len   = queue.length
				let value = queue[0]
				queue.forEach(({ timestamp }) => {
					if (!timeMap[timestamp]) timeMap[timestamp] = 0
					timeMap[timestamp] += 1
				})
			})

			let keys = Object.keys(timeMap),
				lens = keys.length
			for (let i = 0; i < lens; i++) {
				let key = keys[i],
					num = timeMap[key]
				if (num === fieldLen) {
					newTime  = +key
					isSmooth = false
					break
				}
			}

			if (isSmooth) {
				console.log(id, '需要数据不平')
				Object.keys(queues).forEach(key => {
					let queue = queues[key],
						len   = queue.length,
						idx   = 0
					for (let i = 0; i < len; i++) {
						let value = queue[i]
						if (value.timestamp === newTime) {
							idx = i
							break
						}
					}
					if (!idx) return
					queue.splice(0, idx)
					console.log(key, '抹平数据: ', idx)
					len = queue.length
					if (!len) nullLen = true
				})
			}*/
			/* 抹平数据 结束 */

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
				
				// PEF & PIF 相关
				if (key === 'FLOW') {
					let { timestamp } = val
					if (pif[timestamp]) measure['PIF'] = pif[timestamp].toFixed(1)
					if (pef[timestamp]) measure['PEF'] = pef[timestamp].toFixed(1)
				}

				if (!queue.length) return
				if (!wait) {
					queue.shift()
					// console.log(`清除点`)
				}
			})

			Object.assign(Device, {
				alarm,
				clear,
				config,
				device,
				deviceId,
				measure,
				realTime,
				textMessage,
				timestamp: newTime,
			})
		})
	}, time)
}

// 主动清理缓存数据 (根据ID)
export async function cacheClearById(id) {
	let { Cache } = window.__Redux__
	if (!Cache[id]) return
	let { queues } = Cache[id]

	// 遍历波形数据队列
	Object.keys(queues).forEach(key => {
		let queue = queues[key],
			len   = queue.length,
			wait  = cacheWait[key]
		if (!len) return
		if (len > limit * 2) {
			queue = queues[key] = queue.slice(len - limit)
			console.log(id, `超量 - 当前数据量已达: ${len}, 清除${len - limit}条数据!`, queue.length)
		}

	})
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
		cache.textMessage = textMessageData? textMessageData.value: ''
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
	REAL_TIME_DATA(data, cache, id) {
		let { packageCode, realTimeDataList } = data,
			{ queues, clear, clearRef, config, pef, pif } = cache

		realTimeDataList.forEach(realTime => {
			let { code, value, timestamp } = realTime,
				key = code.replace(`${packageCode}_`, '')
			if (!queues[key]) queues[key] = []
			let queue  = queues[key]
			let newVal = +value.toFixed(4)
			// 抹平数据模拟
			let newObj = { value: newVal, timestamp }
			queue.push(newObj)

			let clears = clearRef[key]
			if (!clears) clears = clearRef[key] = []

			let cfg = config[key]

			// 查询清屏索引
			let ringFn = ring[`clear_${key}`]
			if (ringFn && cfg) {
				return ringFn(key, newObj, clearRef, clear, cfg, cache, pef, pif)
			}
		})

		//
		// consoleLog()
		// let key = Object.keys(queues)[0]
		// let queue = queues[key]
		// if (id == 18) {
		// 	console.log(`deviceId: ${id} length: `, queue.length)
		// }
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
	},
	HEARTBEAT(data, cache) {
		let now  = Date.now()
		// let diff = now - __HeartTime__
		clearTimeout(__TimeoutHeart__)
		__TimeoutHeart__ = setTimeout(() => {
			wsClear()
			WS()
		}, 3e4)
		__HeartTime__ = now
		// console.log(`心跳包: ${diff}ms`)
	}
}

// 告警通用方法
function alarmFun(data, cache) {
	let { deviceAlarmList = [] } = data
	if (!deviceAlarmList || !deviceAlarmList.length) deviceAlarmList = []
	cache.alarm = deviceAlarmList
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

// 获取volume的区间差
function getVolumeDiff(config) {
	let conVol  = config['VOLUME']
	return conVol.maxValue - conVol.minValue
}

// 更新全局数据
function ReduxUpdate(o = {}) {
	Object.assign(window.__Redux__, o)
}

// 队列里连续增加

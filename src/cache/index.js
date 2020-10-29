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

	if (!Cache[id]) Cache[id] = { clears: [], alarm: [], queues: {}, measure: {}, volume: {}, clear: {}, config: {}, device, deviceId: id }
	let cache = Cache[id]

	analysisFun(data, cache, id)

	if (!new Set(group).has(id)) group.push(id)

	ReduxUpdate({})
}

// 缓存 进入 渲染
export async function cache2device(time = 100) {
	let { Cache, Devices } = window.__Redux__
	// let MinNumber = {}
	// let preVols = {}
	await _wait(2000)
	deviceKeyVaild()
	clearInterval(__TimeInterval__)
	__TimeInterval__ = setInterval(() => {
		let { group = [] } = Cache
		group.forEach((id, i) => {
			if (!Devices[id]) Devices[id] = {}
			// if (!MinNumber[id])    MinNumber[id] = {}
			// if (!preVols[id]) preVols[id] = {}
			if (!__MIN__[id]) __MIN__[id] = {}

			let MIN    = __MIN__[id]
			// let MINNum = MinNumber[id]
			// let preVol = preVols[id]
			let Device = Devices[id]
			let cache  = Cache[id],
				{ alarm, clear, config, device, deviceId, measure, queues, textMessage } = cache,
				realTime = {}

			// 遍历波形数据队列
			Object.keys(queues).forEach(key => {
				let queue = queues[key],
					len   = queue.length,
					wait  = cacheWait[key]
				if (!len) return

				// 数据量大于缓存数2倍的时候清除多余数据
				if (__VisibilityState__ === 'hidden' && len > limit) {
					console.log(`1当前数据量已达: ${len}, 清除${len - limit}条数据!`)
					queue = queues[key] = queue.slice(len - limit)
					// console.log(queues[key].length)
				}
				if (len > limit * 2) {
					console.log(`2当前数据量已达: ${len}, 清除${len - limit * 2}条数据!`)
					queue = queues[key] = queue.slice(len - limit)
					// console.log(queues[key].length)
				}

				let value = queue[0]

				realTime[key] = !wait && value? { value: value.value }: __Null__
				// 触发等待
				if (!len)         cacheWait[key] = true
				if (len >= limit) cacheWait[key] = false
			})

			/* 抹平数据 开始 */
			// 检测判断是否抹平数据
			let newTime,
				fieldLen = Object.keys(queues).length,
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

			// console.log(newTime, clear)

			if (!isSmooth) {
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
			}
			/* 抹平数据 结束 */

			if (__VisibilityState__ === 'hidden' || nullLen) {
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
				if (!queue.length) return
				if (!wait) val = queue.shift()
				// val = round(val.value)
				// 获取波形基数
				// if (__MIN_STATE__) return	// 判断是否继续计算最小值
				// if (MINNum[key] === undefined) MINNum[key] = 0
				return
				if (MIN[key] === undefined) {
					MIN[key] = val
					// console.log(key, '初始值: ', 10000)
				} else {
					let MX  = abs(MIN[key]),
						// MN  = MINNum[key],
						VAL = abs(val)
					if (VAL < MX) MIN[key] = val
					// if (VAL < MX) { 
					// 	if (MN > 5) {
					// 		MIN[key] = val
					// 		MINNum[key] = 0
					// 		console.log(key, '更新最小值: ', val)
					// 	}
					// 	++MINNum[key]
					// }
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
			{ queues, clear, clears, config, volume } = cache

		realTimeDataList.forEach(realTime => {
			let { code, value, timestamp } = realTime,
				key = code.replace(`${packageCode}_`, '')
			if (!queues[key]) queues[key] = []
			let queue  = queues[key]
			let newVal = +value.toFixed(4)
			// queue.push(+(value).toFixed(4))
			// 抹平数据模拟
			// if (randomRange(0, 1) && randomRange(0, 1) && randomRange(0, 1) && randomRange(0, 1) && randomRange(0, 1)) return
			let newObj = { value: newVal, timestamp }
			queue.push(newObj)
			if (key === 'VOLUME' && config['VOLUME']) {
				clears.push(newObj)
				if (clears.length > 16) clears = cache.clears = clears.slice(clears.length - 16)
				let len = clears.length
				let maxValue = config['VOLUME'].maxValue
				let values = clears.map(_ => _.value)
				let min = Math.min(...values)	// 取最小值
				let minIdx  = 0					// 最小值索引
				let upNum   = 0					// 连续增加次数
				let hasUnique = false	// 是否存在连续的重复数字
				let unique    = null	// 重复数字
				let uniqueIdx = null	// 重复数字索引
				let initIdx   = 5		// 初始查询索引

				// 求最小值索引
				for (let i = 0; i < len; i++) {
					if (values[i] === min) {
						minIdx = i
						break
					}
				}
				if (min < 80 && minIdx === initIdx) {
					// 检测连续重复数字
					values.filter((_, i) => {
						if (i < initIdx) return false
						if (!uniqueIdx && _ === values[i - 1]) {
							uniqueIdx = i - 1
							unique    = values[uniqueIdx]
							hasUnique = true
							return true
						}
						return false
					})
					if (!uniqueIdx || unique === min) return	// 未找到连续值
					let maxRatio = unique / maxValue,			// 最大比: 连续值(高位值)比最大值
						minRatio = unique / min					// 最小比: 连续值(高位值)比最小值

					if (maxRatio < .3) return					// 最大比 < .3舍弃
					// consoleLog()
					// console.log(min, unique, unique / min, unique / maxValue)

					let node = clears[0]
					clear[node.timestamp] = node.value


					// clear去除多余数据 (防止内存泄漏)
					let keys = Object.keys(clear),
						klen = keys.length
					
					if (klen < 5) return
					
					let newClear = {}
					keys = keys.slice(klen - 5)
					keys.forEach(key => {
						newClear[key] = clear[key]
					})
					cache.clear = newClear

					return
					// 过去的算法
					// let max = min
					// values.forEach((cur, i) => {
					// 	if (i <= initIdx || i > uniqueIdx) return
					// 	let prev = values[i - 1]
					// })
					for (let i = initIdx + 1; i < initIdx + 5; i++) {
						let cur  = values[i]
						let prev = values[i - 1]
						let diff = cur - prev
						if (max < cur) max = cur
						if (cur > prev || diff > -20) {
							++upNum
						}
					}
					// 数据跨度大 并 连续增长
					if (max - min > 380 && upNum >= 3) {
						let { updateTime } = volume
						let nowTime = Date.now()
						// 判断是否2s内禁止更新值
						if (updateTime && nowTime - updateTime < 1e3) return// console.log('2s内禁止更新')
						let node = clears[0]
						// if (updateTime) console.log(nowTime - updateTime)
						// console.log(min, max, values, node)
						Object.assign(volume, { updateTime: nowTime })
						clear[node.timestamp] = node.value
					}
					console.log(max - min, upNum)
				}
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

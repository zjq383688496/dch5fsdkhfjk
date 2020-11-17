
// 
export function clear_VOLUME(key, obj, clearRef, clear, cfg, cache) {
	let clears = clearRef[key]
	clears.push(obj)
	if (clears.length > 16) clears = clearRef[key] = clears.slice(clears.length - 16)
	let len = clears.length
	let maxValue = cfg.maxValue
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

		let node = clears[0]
		clear[node.timestamp] = node.value

		clearSurplus(cache)
		// clear去除多余数据 (防止内存泄漏)
		// let keys = Object.keys(clear),
		// 	klen = keys.length
		
		// if (klen < 10) return
		
		// let newClear = {}
		// keys = keys.slice(klen - 10)
		// keys.forEach(key => {
		// 	newClear[key] = clear[key]
		// })
		// cache.clear = newClear
	}
}

// 
export function clear_FLOW(key, obj, clearRef, clear, cfg, cache) {
	let clears = clearRef[key]
	clears.push(obj)
	if (clears.length > 8) clears = clearRef[key] = clears.slice(clears.length - 8)
	let len = clears.length
	let minValue = cfg.minValue
	let values = clears.map(_ => _.value)
	let min = Math.min(...values)	// 取最小值
	let minIdx  = 0					// 最小值索引
	let maxIdx  = 0					// 正数索引
	let initIdx = 3					// 初始查询索引

	// 求最小值索引
	for (let i = 0; i < len; i++) {
		if (values[i] === min) {
			minIdx = i
			break
		}
	}
	if (min < (minValue / 3) && minIdx === initIdx) {
		// 求正值索引
		for (let i = initIdx; i < len; i++) {
			let val = values[i]
			if (val > 0) {
				maxIdx = i
				break
			}
		}

		if (!maxIdx) return

		let node = clears[maxIdx]
		clear[node.timestamp] = node.value

		clearSurplus(cache)
	}
}


let limitNum = 10

// clear去除多余数据 (防止内存泄漏)
function clearSurplus(cache) {
	let { clear } = cache
	let keys = Object.keys(clear),
		klen = keys.length
	
	if (klen < limitNum) return
	
	let newClear = {}
	keys = keys.slice(klen - limitNum)
	keys.forEach(key => {
		newClear[key] = clear[key]
	})
	cache.clear = newClear
}

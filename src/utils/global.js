var { random, round, sqrt } = Math

/* window 扩展方法 */
module.exports = Object.assign(window, {
	// 获取真实数据类型
	getAttr(element) {
		return Object.prototype.toString.call(element).match(/[A-Z][a-z]*/)[0]
	},
	// 判断是否空对象
	isEmptyObject(obj) {
		try {
			return !Object.keys(obj).length
		} catch(e) {
			return false
		}
	},
	// 判断是否数组
	isNumber(num) {
		return typeof num === 'number'
	},
	// 深拷贝
	deepCopy(obj) {
		try {
			return JSON.parse(JSON.stringify(obj))
		} catch(e) {
			console.error(e)
			return obj
		}
	},
	// 对象是否相等
	objEqual(obj1, obj2) {
		try {
			return JSON.stringify(obj1) === JSON.stringify(obj2)
		} catch(e) {
			console.error(e)
			return false
		}
	},
	randomRange(num1 = 0, num2 = 100, digit = 0) {
		return +((num2 - num1) * random() + num1).toFixed(digit)
	},
	pad(num, digit = 3, space = '0') {
		var str    = new Array(digit).join(space) + space
		var numStr = `${str}${num}`.substr(-digit)
		return numStr
	},
	// 节流
	_throttle(action, delay = 160) {
		let last = 0
		return function() {
			var curr = +new Date()
			if (curr - last > delay) {
				action.apply(this, arguments)
				last = curr
			}
		}
	},
	// 防抖
	_debounce(action, delay = 160) {
		let timeout
		return e => {
			clearTimeout(timeout)
			e.persist && e.persist()
			timeout = setTimeout(() => {
				action(e)
			}, delay)
		}
	},

	// 创建遮罩层
	createMask() {
		window.removeMask()
		let mask = document.createElement('div')
		mask.className = 'help-mask'
		document.body.appendChild(mask)
		return mask
	},
	_wait(time = 1000) {
		return new Promise(res => {
			let t = setTimeout(() => {
				clearTimeout(t)
				res()
			}, time)
		})
	},
	// 获取日期时间
	getDate(da = new Date()) {
		let year  = da.getFullYear(),
			month = ('0' + (da.getMonth() + 1)).substr(-2),
			date  = ('0' + da.getDate()).substr(-2),
			hour  = ('0' + da.getHours()).substr(-2),
			minu  = ('0' + da.getMinutes()).substr(-2),
			seco  = ('0' + da.getSeconds()).substr(-2)
		return { year, month, date, hour, minu, seco }
	},
	// 删除遮罩层
	removeMask() {
		let mk = document.querySelectorAll('.help-mask')
		if (!mk.length) return
		mk.forEach(m => document.body.removeChild(m))
	},
	px2vw(px) {
		return `${parseFloat(px) / 19.2}vw`
	},
	Ajax: require('./ajax'),
	// 获取2点距离
	getPointDis(point1, point2 = { x: 0, y: 0 }) {
		let difX = point2.x - point1.x,
			difY = point2.y - point1.y
		return sqrt(difX * difX + difY * difY)
	},
	getVisibilityState() {
		var prefixes = ['webkit', 'moz', 'ms', 'o']
		if ('visibilityState' in document) return 'visibilityState'
		for (var i = 0; i < prefixes.length; i++) {
			if ((prefixes[i] + 'VisibilityState') in document) {
				return prefixes[i] + 'VisibilityState'
			}
		}
		return null
	},
	// log时间
	getLogTime() {
		let now = new Date()
		return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`
	},
	// 打印时间log
	consoleLog() {
		console.log(`↓↓↓↓↓↓↓↓↓↓ ${getLogTime()} ↓↓↓↓↓↓↓↓↓↓`)
	},
	wsClear() {
		clearInterval(__TimeInterval__)
		__ReduxInit__()
		if (!window._ws) return
		if (window._ws.close) window._ws.close()
		window._ws = null 
	}
})
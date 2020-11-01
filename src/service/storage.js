const oneHour = 3600 * 1000
let expireTims  = 2 * oneHour

module.exports = {
	USER_UPDATE() {
		let user = deepCopy(window.__User__)
		user.expire = Date.now() + expireTims
		localStorage.setItem('_u', JSON.stringify(user))
	},
	DEVICE_UPDATE() {
		let { __Grid__, __GridIndex__, __GridMap__, __BedName__ } = window
		let _g = { __Grid__, __GridIndex__, __GridMap__, __BedName__ }
		localStorage.setItem('_g', JSON.stringify(_g))
	},
	USER_CHECK(pathname) {
		let userStr = localStorage.getItem('_u')
		if (!userStr) return null
		let user = JSON.parse(userStr)
		let { expire } = user

		// 检测是否过期
		if (Date.now() > expire) return null

		// 非配置页面
		if (pathname != '/config') {
			let gridStr = localStorage.getItem('_g')
			if (!gridStr) return null
			let gird = JSON.parse(gridStr)
			let __Grid__      = gird.__Grid__      || window.__Grid__,
				__GridIndex__ = gird.__GridIndex__ || window.__GridIndex__,
				__GridMap__   = gird.__GridMap__   || window.__GridMap__,
				__BedName__   = gird.__BedName__   || window.__BedName__
			Object.assign(window, { __Grid__, __GridIndex__, __GridMap__, __BedName__ })
		}

		delete user.expire
		window.__User__ = user
		return user
	}
}

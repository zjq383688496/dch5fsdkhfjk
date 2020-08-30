module.exports = {
	// 获取列表
	list: config => Ajax.get(`/Machines`),

	// 监控盘
	dashboards: id => Ajax.get(`/Dashboards/${id}`),
	// 新建
	login: config => {
		return Ajax.postJSON(`/account/login`, config)
	},

}
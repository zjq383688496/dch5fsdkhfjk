module.exports = {
	// 获取列表
	devices: config => Ajax.get(`/Machines/advancedInfo/all`),
	// 监控盘
	dashboards: id => Ajax.get(`/Dashboards/${id}`),
	// 登录
	login: config => {
		return Ajax.postJSON(`/account/login`, config)
	},
	// login: config => {
	// 	return Ajax.postJSON(`/common/health`, config)
	// },
	// 监控盘
	dashboardsUpdate: (id, config) => Ajax.put(`/Dashboards/${id}`, config),
}
module.exports = {
	// 获取列表
	devices: config => Ajax.get(`/Machines/advancedInfo/all`),
	// 监控盘
	dashboards: id => Ajax.get(`/Dashboards/${id}`),
	// 登录
	login: config => {
		return Ajax.postJSON(`/account/login`, config)
	},
	// 监控盘
	dashboardsUpdate: (id, config) => Ajax.put(`/Dashboards/${id}`, config),

	// 波形回顾
	getReview: (macAddress, startDate) => Ajax.get(`/report/get?macAddress=${macAddress}&startDate=${startDate}`),
	
	// 波形趋势
	getTrendView: (macAddress, timeUnit, dataCodes) => Ajax.get(`/report/getMeasuredDataView?macAddress=${macAddress}&timeUnit=${timeUnit}&dataCodes=${dataCodes}`),

	// 趋势数据
	getTrendData: (macAddress, timeUnit) => Ajax.get(`/report/getMeasuredData?macAddress=${macAddress}&timeUnit=${timeUnit}`),

	// 记事本
	getAlarm: (macAddress, startDate, current, size, type) => Ajax.get(`/report/getAlarm?macAddress=${macAddress}&startDate=${startDate}&current=${current}&size=${size}&type=${type}`),

	// 记事本导出
	export: (macAddress, startDate, type) => `http://${window._BaseUrl_}/report/export?macAddress=${macAddress}&startDate=${startDate}&type=${type}`,
}

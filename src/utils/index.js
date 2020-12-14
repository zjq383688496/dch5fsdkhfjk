module.exports = (function (window) {

	window.ENV = ENV
	window._BaseUrl_ = _BaseUrl_

	require('./prototype')	// 原型链 扩展
	require('./global')		// 全局通用方法
	require('./business')	// 业务相关方法
	require('./var')		// 全局变量

}(window))
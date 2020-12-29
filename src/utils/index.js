module.exports = (function (window) {

	window.ENV = ENV
	window._BaseUrl_ = _BaseUrl_

	require('./global')		// 全局通用方法
	require('./business')	// 业务相关方法
	require('./var')		// 全局变量

}(window))
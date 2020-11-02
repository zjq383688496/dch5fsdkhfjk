var path     = require('path')
var pathRoot = process.cwd()
var baseCfg  = require('./webpack.base.js')
var { dev }  = require('./webpack.rules.js')
var webpack  = require('webpack')

baseCfg.plugins && baseCfg.plugins.unshift(
	new webpack.DefinePlugin({
		ENV:       JSON.stringify('prod'),
		_BaseUrl_: JSON.stringify('draeger-prd.jhdad.com'),
	})
)

Object.assign(baseCfg.output, {
	path: path.resolve(pathRoot, './dist/monitor_static'),
	publicPath: '/monitor_static/',
})

Object.assign(baseCfg, {
	mode: 'production',
	module: {
		rules: [ ...dev ]
	},
})

module.exports = baseCfg
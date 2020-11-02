var baseCfg = require('./webpack.base.js')
var { dev } = require('./webpack.rules.js')
var webpack = require('webpack')

baseCfg.plugins && baseCfg.plugins.unshift(
	new webpack.DefinePlugin({
		ENV:       JSON.stringify('qa'),
		_BaseUrl_: JSON.stringify('94.191.50.139:8089'),
	})
)

Object.assign(baseCfg, {
	mode: 'production',
	module: {
		rules: [ ...dev ]
	},
})

module.exports = baseCfg
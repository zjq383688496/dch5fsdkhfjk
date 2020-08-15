var path = require('path')

var baseCfg = require('./webpack.base.js')
var { dev } = require('./webpack.rules.js')
var webpack = require('webpack')

var port = 8222

baseCfg.plugins && baseCfg.plugins.unshift(
	new webpack.DefinePlugin({
		ENV: JSON.stringify('dev')
	}),
	// 开启 热更新
	new webpack.HotModuleReplacementPlugin(),
	// new webpack.NoErrorsPlugin()
)

Object.assign(baseCfg, {
	// entry: {
	// 	app: ['./src/index']
	// },
	// cache: true,
	output: {
		publicPath: '/',
	},
	mode: 'development',
	devtool: 'eval-source-map',
	module: {
		rules: [ ...dev ]
	},
	devServer: {
		host: '0.0.0.0',
		port: port,
		historyApiFallback: true,
		// stats: 'errors-only',
		inline: true,
		hot: true,
		noInfo: false,
		proxy: {
			'/experiment': 'http://94.191.50.139:8089'
		}
	}
})

module.exports = baseCfg
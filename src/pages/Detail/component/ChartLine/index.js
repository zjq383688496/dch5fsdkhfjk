'use strict';

import React from 'react'
import './index.less'

import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'

export default class ChartLine extends React.Component {
	constructor(props) {
		super(props)
		
		let { fieldX, fieldY, config = {}, realTime = {}, deviceId } = props,
			rtX = realTime[fieldX] || {},
			rtY = realTime[fieldY] || {},
			cX  = config[fieldX] || {},
			cY  = config[fieldY] || {},
			infoX = __Map__.r[fieldX] || {},
			infoY = __Map__.r[fieldY] || {}

		let point = [ rtX.value, rtY.value ]
		let data  = this.data = [ point, ...new Array(0).fill().map(_ => [ null, null ]) ]
		// console.log(rtX.value, rtY.value)
		let options = {
			grid: {
				top:    '20px',
				right:  '10px',
				bottom: '20px',
				left:   '48px',
			},
			xAxis: {
				type: 'value',
				min: cX.minValue || 0,
				max: cX.maxValue || 100,
				// interval: 5,
				splitLine: { show: false },
			},
			yAxis: {
				type: 'value',
				boundaryGap: [0, '100%'],
				// interval: 2,
				splitLine: { show: false },
				min: cY.minValue || 0,
				max: cY.maxValue || 100,
				axisLabel: {
					textStyle: {
						fontSize: 16
					}
				}
			},
			series: [{
				name: '模拟数据',
				type: 'line',
				showSymbol: false,
				hoverAnimation: false,
				data,
				smooth: true,
				lineStyle: {
					color: '#020c7e'
				},
			}],
			animation: false
		}
		this.state = {
			deviceId,
			options,
			fieldX,
			fieldY,
			infoX,
			infoY,
			point,
			equal: 0,
			max: {}
		}
	}
	componentDidMount() {
		// this.task()
	}
	componentWillReceiveProps(props) {
		this.updateData(props)
	}
	componentWillUnmount() {
		clearTimeout(this.timeout)
	}
	timeout = null
	task = () => {
		this.timeout = setTimeout()
	}
	updateData = ({ fieldX, fieldY, config = {}, realTime = {} }) => {
		let { data, echart, state }  = this,
			{ options, point, equal, max, deviceId } = state,
			{ series }  = options,
			MAX  = __MAX__[deviceId],
			mX   = MAX[fieldX],
			mY   = MAX[fieldY]
		if (!echart || !echart.getEchartsInstance) return
		let myChart = echart.getEchartsInstance(),
			rtX = realTime[fieldX] || {},
			rtY = realTime[fieldY] || {},
			vX  = rtX.value,
			vY  = rtY.value,
			cX  = config[fieldX] || {},
			cY  = config[fieldY] || {},
			key = `${vX}_${vY}`,
			_point = [ vX, vY ]


		if (mX && mY && mX[vX] && mY[vY]) {
			console.log(mX, mY)
			this.data = data = [ _point ]
			this.updateChart(myChart, cX, cY, data)
			return this.setState({ data, equal, point: _point, max })
		}

		// if (__MAX__[deviceId]) {}

		// console.log(vX, vY)
		// console.log(JSON.stringify(max))
		// if (!max[key]) max[key] = 0
		// ++max[key]

		// let mv = 0,
		// 	mk = ''
		// Object.keys(max).forEach(key => {
		// 	let v = max[key]
		// 	if (v > mv) {
		// 		mv = v
		// 		mk = key
		// 	}
		// })
		// console.log('maxValue: ', mk, mv)
		// if (JSON.stringify(_point) === JSON.stringify(point)) {
		// 	equal++
		// 	if (equal > 3) {
		// 		this.data = data = [ _point ]
		// 		// console.log('相等: ', equal, vX, vY)
		// 		this.updateChart(myChart, cX, cY, data)
		// 		return this.setState({ data, equal, point: _point, max })
		// 	}
		// } else {
		// 	equal = 0
		// }

		// data.shift()
		data.push([ rtX.value, rtY.value ])

		this.updateChart(myChart, cX, cY, data)

		this.setState({ data, equal, point: _point, max })
	}
	updateChart(chart, x, y, data) {
		chart.setOption({
			xAxis: {
				min: x.minValue || 0,
				max: x.maxValue || 100,
			},
			yAxis: {
				min: y.minValue || 0,
				max: y.maxValue || 100,
			},
			series: [{ data }]
		})
	}
	render() {
		let { options, fieldX, fieldY, infoX, infoY } = this.state

		if (!options) return null

		return (
			<div className="chart-line">
				<div className="cl-title cl-title-t fs24">
					<b>{infoY.n}</b>
					<span>{infoY.u}</span>
				</div>
				<ReactEchartsCore
					ref={e => { if (e) this.echart = e }}
					echarts={echarts}
					notMerge={true}
					lazyUpdate={true}
					option={options}
					style={{height: '100%'}}
				/>
				<div className="cl-title cl-title-b fs24">
					<b>{infoX.n}</b>
					<span>{infoX.u}</span>
				</div>
			</div>
		)
	}
}

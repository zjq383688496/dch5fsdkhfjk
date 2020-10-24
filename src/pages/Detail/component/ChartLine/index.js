'use strict';

import React from 'react'
import './index.less'

import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'

const { abs, round } = Math
const diffVal  = 10
const maxIndex = 5

export default class ChartLine extends React.Component {
	constructor(props) {
		super(props)
		
		let { MIN, fieldX, fieldY, config = {}, realTime = {}, deviceId } = props,
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
				top:    '16px',
				right:  '10px',
				bottom: '20px',
				left:   '48px',
			},
			xAxis: {
				type: 'value',
				min: cX.minValue || 0,
				max: cX.maxValue || 100,
				splitLine: { show: false },
			},
			yAxis: {
				type: 'value',
				boundaryGap: [0, '100%'],
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
			minDis: getPointDis({ x: MIN[fieldX], y: MIN[fieldY] }),
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
		clearTimeout(this.clear_timeout)
	}
	index = 0
	timeout = null
	clear_timeout = null
	clearTask = () => {
		clearTimeout(this.clear_timeout)
		this.clear_timeout = setTimeout(() => {
			this.clearData()
		}, 10000)
	}
	// task = () => {
	// 	this.timeout = setTimeout()
	// }
	clearData = () => {
		let { echart, props } = this,
			{ fieldX, fieldY, config = {}, realTime = {} } = props
		if (!echart || !echart.getEchartsInstance) return
		let myChart = echart.getEchartsInstance()
		let rtX = realTime[fieldX] || {},
			rtY = realTime[fieldY] || {},
			vX  = rtX.value,
			vY  = rtY.value,
			cX  = config[fieldX] || {},
			cY  = config[fieldY] || {},
			_point = [ vX, vY ],
			data = this.data = [ _point ]
		this.updateChart(myChart, cX, cY, data)
		this.index = 0
		this.setState({ data, visibilityState: __VisibilityState__, })
		this.clearTask()
	}
	updateData = ({ fieldX, fieldY, config = {}, realTime = {} }) => {
		let { data, echart, state }  = this,
			{ minDis, options, point, deviceId, visibilityState } = state,
			{ series }  = options
		if (!echart || !echart.getEchartsInstance) return
		let myChart = echart.getEchartsInstance(),
			rtX = realTime[fieldX] || {},
			rtY = realTime[fieldY] || {},
			vX  = rtX.value,
			vY  = rtY.value,
			cX  = config[fieldX] || {},
			cY  = config[fieldY] || {},
			_point = [ vX, vY ]

		if (__VisibilityState__ === 'hidden') return this.clearData()

		let curDis = getPointDis({ x: vX, y: vY }),
			difDis = abs(curDis - minDis)

		if (difDis < diffVal) {
			++this.index
		} else {
			this.index = 0
		}

		if (this.index > maxIndex) return this.clearData()

		data.push([ rtX.value, rtY.value ])
		this.updateChart(myChart, cX, cY, data)
		this.setState({ data, point: _point, visibilityState: __VisibilityState__, })
	}

	updateChart(chart, x = {}, y = {}, data) {
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
					<b className="quota-c">{infoY.n}</b>
					<span className="quota-uc">{infoY.u}</span>
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
					<b className="quota-c">{infoX.n}</b>
					<span className="quota-uc">{infoX.u}</span>
				</div>
			</div>
		)
	}
}

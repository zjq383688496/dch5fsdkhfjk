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
			infoX   = __Map__.r[fieldX] || {},
			infoY   = __Map__.r[fieldY] || {}

		let point = [ rtX.value, rtY.value ]
		let data  = this.data = [ point ]

		let xAxis = [
			{
				type: 'value',
				boundaryGap: [0, '100%'],
				min: getMinValue(cX.minValue, fieldX),
				max: cX.maxValue || 100,
				splitLine: { show: false },
				axisTick: { show: false },
				axisLabel: {
					textStyle: {
						fontSize: 12
					}
				}
			}
		]
		let yAxis = [
			{
				type: 'value',
				boundaryGap: [0, '100%'],
				min: getMinValue(cY.minValue, fieldY),
				max: cY.maxValue || 100,
				splitLine: { show: false },
				axisTick: { show: false },
			}
		]
		if (fieldX === 'VOLUME') {
			xAxis.push({
				position: 'bottom',
				type: 'value',
				boundaryGap: [0, '100%'],
				min: getMinValue(cX.minValue, fieldX),
				max: cX.maxValue || 100,
				splitLine: { show: false },
				axisLabel: { show: false },
				axisTick: { show: true },
			})
		}
		if (fieldY === 'VOLUME') {
			yAxis.push({
				position: 'left',
				type: 'value',
				boundaryGap: [0, '100%'],
				min: getMinValue(cY.minValue, fieldY),
				max: cY.maxValue || 100,
				splitLine: { show: false },
				axisLabel: { show: false },
				axisTick: { show: true },
			})
		}

		let options = {
			grid: {
				top:    '16px',
				right:  '10px',
				bottom: '20px',
				left:   '48px',
			},
			xAxis,
			yAxis,
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
			minDis:  getPointDis({ x: MIN[fieldX], y: MIN[fieldY] }),
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
	clear_time = Date.now()
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
	clearData = (focus = false) => {
		let { echart, props } = this,
			{ fieldX, fieldY, config = {}, realTime = {} } = props
		if (!echart || !echart.getEchartsInstance) return
		let myChart = echart.getEchartsInstance()
		if (!focus) {
			if ((Date.now() - this.clear_time) < 2e3) return
		}
		let rtX = realTime[fieldX] || {},
			rtY = realTime[fieldY] || {},
			vX  = rtX.value,
			vY  = rtY.value,
			cX  = config[fieldX] || {},
			cY  = config[fieldY] || {},
			_point = [ vX, vY ],
			data = this.data = [ _point ]
		this.updateChart(myChart, cX, cY, data, fieldX, fieldY)
		this.index = 0
		this.setState({ data, visibilityState: __VisibilityState__ })
		this.clear_time = Date.now()
		this.clearTask()
		console.log('清屏!')
	}
	updateData = ({ fieldX, fieldY, config = {}, realTime = {} }) => {
		let { data, echart, state, props }  = this,
			{ clear } = props,
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
			_point  = [ vX, vY ],
			curVol  = getVol(realTime)


		if (__VisibilityState__ === 'hidden') return this.clearData(true)

		let curDis = getPointDis({ x: vX, y: vY }),
			difDis = abs(curDis - minDis)

		if (clear) return this.clearData()

		data.push([ rtX.value, rtY.value ])
		this.updateChart(myChart, cX, cY, data, fieldX, fieldY)
		this.setState({ data, point: _point, visibilityState: __VisibilityState__ })
	}

	updateChart(chart, x = {}, y = {}, data, fieldX, fieldY) {
		let xAxis = [
			{
				min: getMinValue(x.minValue, fieldX),
				max: x.maxValue || 100,
			}
		]
		let yAxis = [
			{
				min: getMinValue(y.minValue, fieldY),
				max: y.maxValue || 100,
			}
		]
		if (fieldX === 'VOLUME') {
			xAxis.push({
				min: getMinValue(x.minValue, fieldX),
				max: x.maxValue || 100,
			})
		}
		if (fieldY === 'VOLUME') {
			yAxis.push({
				min: getMinValue(y.minValue, fieldY),
				max: y.maxValue || 100,
			})
		}
		chart.setOption({
			xAxis,
			yAxis,
			series: [{ data }]
		})
	}
	render() {
		let { options, fieldX, fieldY, infoX, infoY } = this.state

		if (!options) return null

		return (
			<div className="chart-line">
				<div className="cl-title cl-title-t fs20">
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
				<div className="cl-title cl-title-b fs20">
					<b className="quota-c">{infoX.n}</b>
					<span className="quota-uc">{infoX.u}</span>
				</div>
			</div>
		)
	}
}

// 获取volume的值
function getVol(realTime) {
	let vol = realTime['VOLUME'] || {}
	return vol.value
}
// 获取volume的区间差
// function getDiff(config) {
// 	let conVol  = config['VOLUME']
// 	return conVol.maxValue - conVol.minValue
// }
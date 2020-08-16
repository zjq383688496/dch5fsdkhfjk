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
		
		let { fieldX, fieldY, config = {}, realTime = {} } = props,
			rtX = realTime[fieldX] || {},
			rtY = realTime[fieldY] || {},
			cX  = config[fieldX] || {},
			cY  = config[fieldY] || {},
			infoX = __Map__.r[fieldX] || {},
			infoY = __Map__.r[fieldY] || {}

		let data = this.data = [ [ rtX.value, rtY.value ], ...new Array(99).fill().map(_ => [ null, null ]) ]

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
				lineStyle: {
					color: '#020c7e'
				},
			}],
			animation: false
		}
		this.state = {
			options,
			fieldX,
			fieldY,
			infoX,
			infoY,
		}
	}
	componentWillReceiveProps(props) {
		this.updateData(props)
	}
	updateData = ({ fieldX, fieldY, config = {}, realTime = {} }) => {
		let { data, echart, state }  = this,
			{ options } = state,
			{ series }  = options
		if (!echart || !echart.getEchartsInstance) return
		let myChart = echart.getEchartsInstance(),
			rtX = realTime[fieldX] || {},
			rtY = realTime[fieldY] || {},
			cX  = config[fieldX] || {},
			cY  = config[fieldY] || {}

		data.shift()
		data.push([ rtX.value, rtY.value ])

		// console.log(data)

		myChart.setOption({
			xAxis: {
				min: cX.minValue || 0,
				max: cX.maxValue || 100,
			},
			yAxis: {
				min: cY.minValue || 0,
				max: cY.maxValue || 100,
			},
			series: [{ data }]
		})

		this.setState({ data })
	}
	getData
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

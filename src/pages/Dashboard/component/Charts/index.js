'use strict';

import React from 'react'
import './index.less'

import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'

const limit = 150

const interval = 49

export default class Charts extends React.Component {
	constructor(props) {
		super(props)

		let { config, realTime, field } = props,
			{ u: unit, n: name }   = __Map__.r[field] || {},
			{ minValue, maxValue } = config[field] || {}

		let data = this.data = new Array(limit).fill().map(_ => __Null__)
		let min = getMinValue(minValue, field)
		let max = getMaxValue(maxValue)
		let interval = getInterval(min, max, field)
		let xAxis = createXAxis(limit)
		xAxis[1].axisTick.length = 6
		xAxis[1].axisLabel.textStyle.fontSize = 10
		let options = {
			grid: {
				top:    '6px',
				right:  '20px',
				bottom: '20px',
				left:   '32px',
			},
			xAxis,
			yAxis: {
				type: 'value',
				boundaryGap: [0, '100%'],
				splitLine: { show: false },
				min,
				max,
				axisLabel: {
					textStyle: {
						fontSize: 10
					},
				},
				interval,
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
			index: 0,
			options,
			name,
			unit,
			field,
		}
	}
	componentWillReceiveProps(props) {
		this.updateData(props)
	}
	clearData = () => {
		let data = this.data = [ ...new Array(limit + 1).fill().map(_ => __Null__) ]
		let index = this.index = 0
		this.setState({ index, data })
	}
	updateData = ({ config, realTime, field }) => {
		let { data, echart, state }  = this,
			{ index, options, visibilityState } = state,
			{ minValue, maxValue } = config[field] || {},
			{ series }  = options,
			value = realTime[field]

		if (!echart || !echart.getEchartsInstance) return
		let myChart = echart.getEchartsInstance()

		if (__VisibilityState__ === 'hidden') return this.clearData()

		data[index] = value
		++index
		if (index >= limit) index = 0
		data[index] = __Null__

		let min = getMinValue(minValue, field)
		let max = getMaxValue(maxValue)
		let interval = getInterval(min, max, field)

		myChart.setOption({
			yAxis: {
				min,
				max,
				interval,
			},
			series: [{ data }]
		})

		this.setState({ data, index })
	}
	getZero(min, max) {
		let range = max - min
		if (min >= 0 || max <= 0) return null
		let minVal = Math.min(Math.abs(min), max)
		let ratio  = minVal / range * 100
		if (ratio < 9) return null
		let top = max / range * 100 + '%'
		return (
			<div className="cd-tick-zero" style={{ top }}>
				<span>0</span>
				{/*<div className="cd-tick-line"></div>*/}
			</div>
		)
	}
	render() {
		let { active, config, data, field, handleClick } = this.props,
			{ minValue, maxValue }  = config[field] || {}
		let { options, name, unit } = this.state
		let min  = getMinValue(minValue, field)
		let max  = getMaxValue(maxValue)
		let zero = this.getZero(min, max)
		return (
			<div className={`charts-draw${active? ' s-active': ''}`} onClick={handleClick}>
				<div className="cd-title fs14">
					<b className="quota-c">{name}</b>
					<span className="quota-uc">{unit}</span>
				</div>
				<div className="cd-chart">
					<div className="cd-tick">
						{zero}
					</div>
					<ReactEchartsCore
						ref={e => { if (e) this.echart = e }}
						echarts={echarts}
						notMerge={false}
						lazyUpdate={false}
						option={options}
						style={{height: '100%'}}
					/>
				</div>
			</div>
		)
	}
}

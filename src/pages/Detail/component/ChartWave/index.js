import React from 'react'
import './index.less'

import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'


const colorMap = {
	'tan':    '#a89f20',
	'blue-d': '#020c7e',
}

const limit = 200

export default class ChartWave extends React.Component {
	constructor(props) {
		super(props)

		let { color = 'blue-d', config, realTime, field } = props,
			{ u: unit, n: name } = __Map__.r[field] || {},
			{ minValue, maxValue } = config[field] || {}

		let data = this.data = new Array(limit).fill().map(_ => __Null__)

		let options = {
			grid: {
				top:    '16px',
				right:  '20px',
				bottom: '24px',
				left:   '56px',
			},
			xAxis: createXAxis(limit),
			yAxis: {
				type: 'value',
				boundaryGap: [0, '100%'],
				interval: 1000,
				splitLine: { show: false },
				min: getMinValue(minValue, field),
				max: maxValue || 100,
				axisLabel: {
					textStyle: {
						fontSize: 12
					}
				},
			},
			series: [{
				name: '模拟数据',
				type: 'line',
				areaStyle: {
					color: colorMap[color],
				},
				showSymbol: false,
				hoverAnimation: false,
				smooth: true,
				data,
				lineStyle: {
					width: 0,
				},
			}],
			animation: false
		}
		this.state = {
			options,
			color,
			index : 0,
			name,
			unit,
		}
	}
	componentWillReceiveProps(props) {
		this.updateData(props)
	}
	clearData = () => {
		let data = this.data = new Array(limit).fill().map(_ => __Null__)
		let index = this.index = 0
		this.setState({ index, data })
	}
	updateData = ({ config, realTime, field }) => {
		let { data, echart, state }  = this,
			{ index, options, visibilityState } = state,
			{ series } = options

		if (!echart || !echart.getEchartsInstance) return
		let myChart = echart.getEchartsInstance()

		if (__VisibilityState__ === 'hidden') return this.clearData()

		let { minValue, maxValue } = config[field] || {}
		data[++index] = realTime[field]
		data[index == limit? 0: index + 1] = null
		if (index >= limit) index = 0

		myChart.setOption({
			yAxis: {
				min: getMinValue(minValue, field),
				max: maxValue || 100,
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
			<div className="cw-tick-num" style={{ top }}>
				<span>0</span>
				{/*<div className="cw-tick-line"></div>*/}
			</div>
		)
	}
	render() {
		let { config, field } = this.props,
			{ color, name, unit, options } = this.state,
			{ minValue, maxValue } = config[field] || {},
			min  = getMinValue(minValue, field),
			max  = getMaxValue(maxValue),
			zero = this.getZero(min, max)
		return (
			<div className="chart-wave">
				<div className={`cw-title fs24 c-${color}`}>
					<b className="quota-c">{name}</b>
					<span className="quota-uc">{unit}</span>
				</div>
				<div className="cw-chart">
					<div className="cw-tick">
						{zero}
					</div>
					<ReactEchartsCore
						ref={e => { if (e) this.echart = e }}
						echarts={echarts}
						notMerge={true}
						lazyUpdate={true}
						option={options}
						style={{height: '100%'}}
					/>
				</div>
			</div>
		)
	}
}

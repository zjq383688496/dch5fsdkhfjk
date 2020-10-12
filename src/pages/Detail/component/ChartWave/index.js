import React from 'react'
import './index.less'

import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'

const { ceil } = Math

const colorMap = {
	'tan':    '#a89f20',
	'blue-d': '#020c7e',
}

const limit = 201 - 1
const interval = 49

export default class ChartWave extends React.Component {
	constructor(props) {
		super(props)

		let { color = 'blue-d', config, realTime, field } = props,
			{ u: unit, n: name } = __Map__.r[field] || {},
			{ minValue, maxValue } = config[field] || {}

		let data = this.data = [ realTime[field], ...new Array(limit).fill().map(_ => null) ]

		let options = {
			grid: {
				top:    '32px',
				right:  '20px',
				bottom: '56px',
				left:   '56px',
			},
			xAxis: {
				type: 'category',
				data: splitNumber(limit),
				axisTick: {
					interval,
				},
				axisLabel: {
					interval: (index, value) => {
						return ({
							0:   true,
							50:  true,
							100: true,
							150: true,
							199: true,
						})[index]
					},
					verticalAlign: 'top',
				}
			},
			yAxis: {
				type: 'value',
				boundaryGap: [0, '100%'],
				interval: 1000,
				splitLine: { show: false },
				min: minValue || 0,
				max: maxValue || 100,
				axisLabel: {
					textStyle: {
						fontSize: 16
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
		let data = this.data = [ ...new Array(limit).fill().map(_ => null) ]
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
				min: minValue || 0,
				max: maxValue || 100,
			},
			series: [{ data }]
		})

		this.setState({ data, index })
	}
	render() {
		let { color, name, unit, options } = this.state
		return (
			<div className="chart-wave">
				<div className={`cw-title fs24 c-${color}`}>
					<b>{name}</b>
					<span>{unit}</span>
				</div>
				<div className={`cw-subtitle fs18`}>
					<b>时间/秒</b>
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
		)
	}
}

function splitNumber(limit, split = 50, div = 10) {
	return new Array(limit).fill().map((_, i) => {
		if (!i) return 0
		if (i === limit.length - 1) return limit / div
		// let num = i % split
		let num = ceil(i / 10)
		return num
		// return num? '': i / div
	})
}

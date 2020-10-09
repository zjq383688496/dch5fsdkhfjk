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

const limit = 201 - 1

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
				min: 0,
				max: limit,
				data: splitNumber(limit),
				axisTick: {
					interval: 50,
				},
				axisLabel: {
					verticalAlign: 'middle',
				}
			},
			yAxis: {
				type: 'value',
				boundaryGap: [0, '100%'],
				// splitNumber: 1,
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
	updateData = ({ config, realTime, field }) => {
		let { data, echart, state }  = this,
			{ index, options } = state,
			{ series } = options
		if (!echart || !echart.getEchartsInstance) return
		let myChart = echart.getEchartsInstance()
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
		let { color, name, options } = this.state
		return (
			<div className="chart-wave">
				<div className={`cw-title fs24 c-${color}`}>
					<b>{name}</b>
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
	return new Array(limit + 1).fill().map((_, i) => {
		let num = i % split
		return num? '': i / div
	})
}

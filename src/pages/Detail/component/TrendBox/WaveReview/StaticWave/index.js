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

const interval = 49

export default class StaticWave extends React.Component {
	constructor(props) {
		super(props)

		let { color = 'blue-d', data, left, right } = props,
			{ list = [], unit, name, minValue, maxValue } = data || {}

		let limit = list.length
		let options = {
			grid: {
				top:    '10px',
				right:  `${right}px`,
				bottom: '24px',
				left:   `${left}px`,
			},
			xAxis: {
				type: 'category',
				data: getChartsSplit(limit),
				axisTick: {
					interval,
				},
				axisLabel: {
					interval: (index, value) => {
						return getChartsInterval(limit)[index]
					},
					verticalAlign: 'top',
					textStyle: {
						fontSize: 16
					}
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
				}
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
				data: list,
				lineStyle: {
					width: 0,
				},
			}],
			animation: false
		}
		this.state = {
			options,
			color,
			index: 0,
			name,
			unit,
		}
	}
	render() {
		let { color, name, unit, options } = this.state
		return (
			<div className="r-chart-wave">
				<div className={`cw-title fs24 c-${color}`}>
					<b className="quota-c">{name}</b>
					<span className="quota-uc">{unit}</span>
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
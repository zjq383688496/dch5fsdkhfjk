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

export default class StaticWave extends React.Component {
	constructor(props) {
		super(props)

		let { color = 'blue-d', data } = props,
			{ list, unit, name, minValue, maxValue } = data || {}

		let options = {
			grid: {
				top:    '32px',
				right:  '10px',
				bottom: '32px',
				left:   '56px',
			},
			xAxis: {
				type: 'category',
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
						fontSize: 12
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
			index : 0,
			name,
			unit,
		}
	}
	render() {
		let { color, name, options } = this.state
		return (
			<div className="w-chart-wave">
				<div className={`cw-title fs24 c-${color}`}>
					<b>{name}</b>
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

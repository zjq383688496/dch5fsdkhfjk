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

const { abs } = Math

export default class StaticWave extends React.Component {
	constructor(props) {
		super(props)

		let { color = 'blue-d', data, left, right, field } = props,
			{ list = [], unit, name, minValue, maxValue } = data || {}

		let limit = list.length
		let options = {
			grid: {
				top:    '10px',
				right:  `${right}px`,
				bottom: '0px',
				left:   `${left}px`,
			},
			xAxis: {
				type: 'category',
				axisLine: {
					lineStyle: {
						type: 'dashed'
					}
				},
				axisTick:  { show: false },
				axisLabel: { show: false },
			},
			yAxis: {
				type: 'value',
				boundaryGap: [0, '100%'],
				// splitNumber: 1,
				interval: 1000,
				splitLine: { show: false },
				min: getMinValue(minValue, field),
				max: maxValue || 100,
				axisTick:  { show: false },
				axisLabel: { show: false },
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
			minValue,
			maxValue,
			field
		}
	}
	render() {
		let { color, name, unit, options } = this.state,
			{ data, field } = this.props,
			{ minValue, maxValue } = data || {},
			min = getMinValue(minValue, field),
			max = maxValue || 100,
			hasZero = false,
			range  = max - min,
			minVal = Math.min(abs(min), max),
			ratio  = minVal / range * 100,
			top = '100%'

		if (ratio > 8) hasZero = true
		if (min < 0) {
			top = (100 - abs(min) / range * 100) + '%'
		}

		return (
			<div className="r-chart-wave">
				<div className={`cw-title fs24 c-${color}`}>
					<b className="quota-c">{name}</b>
					<span className="quota-uc">{unit}</span>
				</div>
				<div className="y-line"></div>
				<div className="y-max-min">
					<span>{max}</span>
					<span>{min}</span>
				</div>
				{
					hasZero
					? (
						<div className="y-zero">
							<div style={{ top }}>0</div>
						</div>
					)
					: null
				}
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
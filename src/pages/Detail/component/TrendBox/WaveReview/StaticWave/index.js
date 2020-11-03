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
				max: getMaxValue(maxValue),
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
				<div className="cw-tick-line"></div>
			</div>
		)
	}
	getNum(min, max, num) {
		let range = max - min
		num -= min
		let top = (100 - num / range * 100) + '%'
		return top
	}
	render() {
		let { color, name, unit, options } = this.state,
			{ data, field } = this.props,
			{ minValue, maxValue } = data || {},
			min  = getMinValue(minValue, field),
			max  = getMaxValue(maxValue),
			zero = this.getZero(min, max),
			maxTop = this.getNum(min, max, max),
			minTop = this.getNum(min, max, min)

		return (
			<div className="r-chart-wave">
				<div className={`cw-title fs24 c-${color}`}>
					<b className="quota-c">{name}</b>
					<span className="quota-uc">{unit}</span>
				</div>
				<div className="y-line"></div>
				<div className="cw-chart">
					<div className="cw-tick">
						<div className="cw-tick-num" style={{ top: maxTop }}>
							<span>{max}</span>
							<div className="cw-tick-line"></div>
						</div>
						{zero}
						<div className="cw-tick-num" style={{ bottom: 0 }}>
							<span>{min}</span>
						</div>
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
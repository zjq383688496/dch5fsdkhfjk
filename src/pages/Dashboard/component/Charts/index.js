'use strict';

import React from 'react'
import './index.less'

import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'

const limit = 150 - 1

export default class Charts extends React.Component {
	constructor(props) {
		super(props)

		let { config, realTime, field } = props,
			{ u: unit, n: name }   = __Map__.r[field] || {},
			{ minValue, maxValue } = config[field] || {}

		let data = this.data = [ realTime[field], ...new Array(limit).fill().map(_ => __Null__) ]
		let options = {
			grid: {
				top:    '14px',
				right:  '2px',
				bottom: '14px',
				left:   '32px',
			},
			xAxis: {
				type: 'category',
			},
			yAxis: {
				type: 'value',
				boundaryGap: [0, '100%'],
				splitLine: { show: false },
				min: minValue || 0,
				max: maxValue || 100,
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
	updateData = ({ config, realTime, field }) => {
		let { data, echart, state }  = this,
			{ index, options } = state,
			{ minValue, maxValue } = config[field] || {},
			{ series }  = options,
			value = realTime[field]

		if (!echart || !echart.getEchartsInstance) return
		let myChart = echart.getEchartsInstance()

		data[++index] = value
		data[index == limit? 0: index + 1] = __Null__
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
		let { data, handleClick }   = this.props
		let { options, name, unit } = this.state

		return (
			<div className="charts-draw" onClick={handleClick}>
				<div className="cd-title fs14">
					<b style={{ marginRight: 5 }}>{name}</b>
					<span className="c-gray">{unit}</span>
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
		)
	}
}

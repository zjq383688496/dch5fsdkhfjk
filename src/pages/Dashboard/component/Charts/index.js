'use strict';

import React from 'react'
import './index.less'

import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'

export default class Charts extends React.Component {
	constructor(props) {
		super(props)

		let { config, realTime, field } = props,
			{ u: unit, n: name }   = __Map__.r[field] || {},
			{ minValue, maxValue } = config[field] || {}

		let data = this.data = [ realTime[field] || null, ...new Array(99).fill().map(_ => null) ]
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
			series: {
				name: '模拟数据',
				type: 'line',
				showSymbol: false,
				hoverAnimation: false,
				data,
				lineStyle: {
					color: '#020c7e'
				},
			},
			animation: false
		}
		this.state = {
			index: 0,
			options,
			name,
			unit,
		}
	}
	componentWillReceiveProps(props) {
		this.updateData(props)
	}
	updateData = ({ config, realTime, field }) => {
		let { data, echart, state }  = this,
			{ index, curId, options } = state,
			{ minValue, maxValue } = config[field] || {},
			{ series }  = options


		if (!echart || !echart.getEchartsInstance) return
		let myChart = echart.getEchartsInstance()

		data[++index] = realTime[field]
		data[index == 99? 0: index + 1] = null
		if (index >= 99) index = 0

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
		let { data } = this.props
		let { options, name, unit } = this.state

		return (
			<div className="charts-draw">
				<div className="cd-title fs14">
					<b>{name}</b>
					<span className="c-gray">{unit}</span>
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

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

export default class WaveStacked extends React.Component {
	constructor(props) {
		super(props)

		let { color = 'blue-d', data } = props,
			{ list, unit, name, minValue, maxValue } = data || {}

		let options = {
			grid: {
				top:    '0',
				right:  '0',
				bottom: '0',
				left:   '0',
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
				show: true,
			},
			yAxis: [
				{
					type: 'value',
					interval: 1000,
					min: 0,
					max: 250,
					show: false,
				},
				{
					type: 'value',
					interval: 1000,
					min: 0,
					max: 350,
					show: false,
				},
				{
					type: 'value',
					interval: 1000,
					min: 0,
					max: 450,
					show: false,
				}
			],
			series: [
				{
					name: '邮件营销',
					yAxisIndex: 0,
					type: 'line',
					showSymbol: false,
					data: [120, 132, 101, 134, 90, 230, 210]
				},
				{
					name: '联盟广告',
					yAxisIndex: 1,
					type: 'line',
					showSymbol: false,
					data: [220, 182, 191, 234, 290, 330, 310]
				},
				{
					name: '视频广告',
					yAxisIndex: 2,
					type: 'line',
					showSymbol: false,
					data: [150, 232, 201, 154, 190, 330, 410]
				},
			],
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
		let { color, name, options } = this.state
		return (
			<div className="wave-stacked">
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

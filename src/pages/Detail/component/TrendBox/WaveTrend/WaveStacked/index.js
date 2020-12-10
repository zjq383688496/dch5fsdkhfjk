import React from 'react'
import './index.less'

import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'

// import moment from 'moment'

export default class WaveStacked extends React.Component {
	constructor(props) {
		super(props)

		let { colors = [], list = [], xAxis, parent, times = [] } = props

		let length = list[0].data.length
		let width  = parent.clientWidth

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
				data: getCategory(times, width, length),
				show: false,// xAxis,
				// axisTick: {
				// 	length: 6,
				// }
			},
			yAxis: getYAxis(list),
			// [
			// 	{
			// 		type: 'value',
			// 		interval: 1000,
			// 		min: 0,
			// 		max: 250,
			// 		show: false,
			// 	},
			// 	{
			// 		type: 'value',
			// 		interval: 1000,
			// 		min: 0,
			// 		max: 350,
			// 		show: false,
			// 	},
			// 	{
			// 		type: 'value',
			// 		interval: 1000,
			// 		min: 0,
			// 		max: 450,
			// 		show: false,
			// 	}
			// ],
			series: getSeries(list, colors),
			// [
			// 	{
			// 		yAxisIndex: 0,
			// 		type: 'line',
			// 		showSymbol: false,
			// 		data: [120, 132, 101, 134, 90, 230, 210]
			// 	},
			// 	{
			// 		yAxisIndex: 1,
			// 		type: 'line',
			// 		showSymbol: false,
			// 		data: [220, 182, 191, 234, 290, 330, 310]
			// 	},
			// 	{
			// 		yAxisIndex: 2,
			// 		type: 'line',
			// 		showSymbol: false,
			// 		data: [150, 232, 201, 154, 190, 330, 410]
			// 	},
			// ],
			animation: false,
		}
		this.state = {
			options,
			length,
			width: parent.clientWidth,
			gridH: 0,
		}
	}
	componentDidMount() {
		this.init()
	}
	init = () => {
		let { onLoaded } = this.props
		let { wave } = this.refs
		if (!wave) return
		this.setState({ gridH: Math.ceil(wave.clientHeight / 5) })
		onLoaded && onLoaded(wave)
	}
	getGridStyle = () => {
		let { gridH } = this.state
		if (!gridH) return {}
		let minH = gridH - 1
		return {
			background:     `-webkit-linear-gradient(top, transparent ${minH}px, #999 ${gridH}px),-webkit-linear-gradient(left, transparent ${minH}px, #999 ${gridH}px)`,
			backgroundSize: `${gridH}px ${gridH}px`
		}
	}
	render() {
		let { name, options, length, width } = this.state
		let style = { height: '100%', ...this.getGridStyle() }
		if (length > width) style.width = length
		return (
			<div ref="wave" className="wave-stacked">
				<ReactEchartsCore
					ref={e => { if (e) this.echart = e }}
					echarts={echarts}
					notMerge={true}
					lazyUpdate={true}
					option={options}
					style={style}
				/>
			</div>
		)
	}
}

// 创建x轴数据
function getCategory(times, width, length) {
	return times.map((timestamp, i) => {
		// let da   = moment(timestamp)
		// // let time = da.format('HH:mm')
		// let time = da.format('HH:mm:ss')
		// let date = da.format('YYYY-MM-DD')
		// if (!i || i === length - 1) return date
		// if (time === '00:00:00') return date
		return ''
	})
}
// 创建y轴数据
function getYAxis(list) {
	return list.map(({ min, max }) => {
		return {
			type: 'value',
			min,
			max,
			show: false,
		}
	})
}
// 生成数据
function getSeries(list, colors) {
	return list.map((item, i) => {
		let { data } = item
		return {
			yAxisIndex: i,
			type: 'line',
			showSymbol: false,
			data: data.map(({ value }) => value),
			lineStyle: {
				color: colors[i],
				width: 1,
			},
		}
	})
}

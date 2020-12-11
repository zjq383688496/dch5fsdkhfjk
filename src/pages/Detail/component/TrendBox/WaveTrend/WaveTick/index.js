import React from 'react'
import './index.less'

import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'

import moment from 'moment'

export default class WaveTick extends React.Component {
	constructor(props) {
		super(props)

		let { width, times = [] } = props

		let length   = times.length
		let interval = getChartsTickInterval(times)

		let options = {
			grid: {
				top:    '0',
				right:  '1px',
				bottom: '20px',
				left:   '0',
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: getCategory(times),
				show: true,
				axisTick: {
					interval,
					length: 6,
				},
				axisLabel: {
					interval,
					verticalAlign: 'top',
					textStyle: {
						fontSize: 12
					}
				},
			},
			yAxis: {
				type: 'value',
				show: false,
			},
			series: [],
			animation: false,
		}
		this.state = {
			options,
			length,
			width,
		}
	}
	componentDidMount() {
		this.init()
	}
	init = () => {
		let { onLoaded } = this.props
		let { wave } = this.refs
		if (!wave) return
		onLoaded && onLoaded(wave)
	}
	render() {
		let { name, options, length, width } = this.state
		let style = { height: '100%' }
		if (length > width) style.width = length
		return (
			<div ref="wave" className="wave-tick">
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
function getCategory(times) {
	let length = times.length
	return times.map((timestamp, i) => {
		let da   = moment(timestamp)
		// let time = da.format('HH:mm')
		let time = da.format('HH:mm:ss')
		let date = da.format('MM-DD')
		if (!i) {
			return {
				value: date,
				textStyle: {
					align: 'left',
				}
			}
		}
		if (i === length - 1) {
			return {
				value: date,
				textStyle: {
					align: 'right',
				}
			}
		}
		return date
		// if (time === '00:00:00') return date
		// return ''
	})
}

// 获取图表分割数据的可见索引
function getChartsTickInterval(times) {
	let length = times.length
	let obj = {}
	// let dates = []
	times.forEach((timestamp, i) => {
		let da   = moment(timestamp)
		let time = da.format('HH:mm')
		// dates.push(da.format('MM-DD HH:mm:ss'))
		if (!i || i >= length - 1) return obj[i] = true
		if (time === '00:00') return obj[i] = true
		obj[i] = false
	})
	// console.log(dates)
	// console.log(length, obj)
	return function(index) {
		return obj[index]
	}
}
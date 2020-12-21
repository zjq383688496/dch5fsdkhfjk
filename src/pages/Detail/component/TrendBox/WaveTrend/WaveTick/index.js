import React from 'react'
import './index.less'

import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'

import moment from 'moment'


export default class WaveTick extends React.Component {
	constructor(props) {
		super(props)

		let { width, times = [], gridH, multiple } = props

		let length    = times.length
		let interval  = getChartsTickInterval(times)
		let interval2 = getChartsTickInterval2(times)

		let options = {
			grid: {
				top:    '0',
				right:  '0',
				bottom: '30px',
				left:   '0',
			},
			xAxis: {
				type: 'category',
				boundaryGap: true,
				data: getCategory(times, multiple),
				show: true,
				axisTick: {
					interval,
					length: 6,
				},
				axisLabel: {
					interval,
					verticalAlign: 'top',
					textStyle: {
						fontSize: 10
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
		let options2 = {
			grid: {
				top:    '0',
				right:  '0',
				bottom: '30px',
				left:   '0',
			},
			xAxis: {
				type: 'category',
				boundaryGap: true,
				data: getCategory2(times, multiple),
				show: true,
				axisLine: {
					show: false,
				},
				axisTick: {
					show: false,
					interval: interval2,
				},
				axisLabel: {
					interval: interval2,
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
			options2,
			length,
			gridH,
			width,
			times: deepCopy(times),
		}
	}
	componentDidMount() {
		this.init()
	}
	componentWillReceiveProps(props) {
		let { state } = this
		let { times, gridH } = props
		if (objEqual(times, state.times) && gridH === state.gridH) return
		console.log('更新下标!')
		this.updateData(props)
	}
	init = () => {
		let { onLoaded } = this.props
		let { wave } = this.refs
		if (!wave) return
		onLoaded && onLoaded(wave)
	}
	updateData = ({ width, times = [], gridH, multiple }) => {
		let { echart, echart2 }  = this

		if (!echart || !echart.getEchartsInstance) return
		let myChart  = echart.getEchartsInstance()
		let myChart2 = echart2.getEchartsInstance()

		let length    = times.length
		let interval  = getChartsTickInterval(times, gridH * 2)
		let interval2 = getChartsTickInterval2(times, gridH * 2)

		myChart.setOption({
			xAxis: {
				data: getCategory(times, multiple),
				axisTick: {
					interval,
				},
				axisLabel: {
					interval,
				},
			},
		})

		myChart2.setOption({
			xAxis: {
				data: getCategory2(times, multiple),
				axisTick: {
					interval: interval2,
				},
				axisLabel: {
					interval: interval2,
				},
			},
		})

		this.setState({ times: deepCopy(times), length: times.length, gridH })
	}
	render() {
		let { multiple } = this.props
		let { name, options, options2, length, width } = this.state
		let style = { width: '100%', height: '100%' }
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
				<ReactEchartsCore
					className={'wt-rec2'}
					ref={e => { if (e) this.echart2 = e }}
					echarts={echarts}
					notMerge={true}
					lazyUpdate={true}
					option={options2}
					style={{ ...style, display: multiple === 1? 'none': 'block' }}
				/>
			</div>
		)
	}
}

// 创建x轴数据
function getCategory(times, multiple) {
	let length = times.length
	let ticks  = times.map((timestamp, i) => {
		let da   = moment(timestamp)
		let time = da.format('HH:mm')
		let date = da.format('MM-DD')
		// console.log(date)
		let val  = multiple === 1? date: time

		// if (multiple != 1 && time == '00:00') val = date

		if (!i) {
			return {
				value: val,
				textStyle: {
					align: 'left',
				}
			}
		}
		if (i > length - 12) {
			return {
				value: val,
				textStyle: {
					align: 'right',
				}
			}
		}
		return val
	})
	return ticks
}
// 日期
function getCategory2(times, multiple) {
	let length = times.length
	return times.map((timestamp, i) => {
		let da   = moment(timestamp)
		let date = da.format('MM-DD')
		let val  = date
		return val
	})
}

// 获取图表分割数据的可见索引
function getChartsTickInterval(times) {
	let length = times.length
	let size   = length / 15
	let obj    = {}
	times.forEach((timestamp, i) => {
		let zz = i % (size * 2)
		let da   = moment(timestamp)
		let time = da.format('HH:mm')
		// if (time == '00:00') return obj[i] = true
		if (zz == 0) return obj[i] = true
		obj[i] = false
	})
	return function(index) {
		return obj[index]
	}
}
function getChartsTickInterval2(times) {
	let obj    = {}
	times.forEach((timestamp, i) => {
		let da   = moment(timestamp)
		let time = da.format('HH:mm')
		if (time == '00:00') return obj[i] = true
		obj[i] = false
	})
	return function(index) {
		return obj[index]
	}
}
/*function getChartsTickInterval(times, gridH) {
	let length = times.length
	let size   = times / 15
	let obj = {}
	// let grid = gridH
	let grid = +gridH.toFixed(2)
	times.forEach((timestamp, i) => {
		let zz = i % grid
		let da   = moment(timestamp)
		let time = da.format('HH:mm')
		if (!i) return obj[i] = true
		if (zz < 1) {
			return obj[i - 1] = true
			// return obj[i] = true
		}
		obj[i] = false
	})
	return function(index) {
		return obj[index]
	}
}*/
import React from 'react'
import './index.less'

import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'

import moment from 'moment'


export default class WaveTick extends React.Component {
	constructor(props) {
		super(props)

		let { width, times = [], gridH } = props

		let length   = times.length
		let interval = getChartsTickInterval(times, gridH * 2)

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
				data: getCategory(times, gridH * 2),
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
		this.state = {
			options,
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
		if (times.length === state.times.length && gridH === state.gridH) return
		this.updateData(props)
	}
	init = () => {
		let { onLoaded } = this.props
		let { wave } = this.refs
		if (!wave) return
		onLoaded && onLoaded(wave)
	}
	updateData = ({ width, times = [], gridH }) => {
		let { echart }  = this

		if (!echart || !echart.getEchartsInstance) return
		let myChart = echart.getEchartsInstance()

		let length   = times.length
		let interval = getChartsTickInterval(times, gridH * 2)

		myChart.setOption({
			xAxis: {
				data: getCategory(times, gridH * 2),
				axisTick: {
					interval,
				},
				axisLabel: {
					interval,
				},
			},
		})

		this.setState({ times: deepCopy(times), length: times.length, gridH })
	}
	render() {
		let { name, options, length, width } = this.state
		let style = { height: '100%', width: length }
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
function getCategory(times, gridH) {
	let length = times.length
	return times.map((timestamp, i) => {
		let da   = moment(timestamp)
		let time = da.format('HH:mm')
		let date = da.format('MM-DD')
		let val  = time

		if (!i) {
			return {
				value: val,
				textStyle: {
					align: 'left',
				}
			}
		}
		// if (i === length - 1) {
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
}

// 获取图表分割数据的可见索引
function getChartsTickInterval(times, gridH) {
	let length = times.length
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
}
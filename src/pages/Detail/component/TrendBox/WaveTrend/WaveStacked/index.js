import React from 'react'
import './index.less'

import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'

export default class WaveStacked extends React.Component {
	constructor(props) {
		super(props)

		let { colors = [], list = [], times = [], multiple = 1 } = props

		let length = times.length

		let options = {
			grid: {
				top:    '0',
				right:  '0',
				bottom: '0',
				left:   '0',
			},
			xAxis: {
				type: 'category',
				boundaryGap: true,
				data: [],
				show: false,
			},
			yAxis:  getYAxis(list),
			series: getSeries(list, colors),
			animation: false,
		}
		this.state = {
			times: deepCopy(times),
			options,
			length,
			height: 0,
		}
	}
	componentWillReceiveProps(props) {
		let { state } = this
		let { times } = props
		// if (times.length === state.times.length) return
		if (objEqual(times, state.times)) return
		// console.log('更新图表!')
		this.updateData(props)
	}
	componentDidMount() {
		this.init()
	}
	init = () => {
		let { scrollCfg, onLoaded } = this.props
		let { wave } = this.refs
		if (!wave) return
		if (scrollCfg && scrollCfg.scrollLeft) {
			wave.scrollLeft = scrollCfg.scrollLeft
		}
		onLoaded && onLoaded(wave)
	}
	updateData = ({ colors = [], list = [], times = [] }) => {
		let { echart }  = this

		if (!echart || !echart.getEchartsInstance) return
		let myChart = echart.getEchartsInstance()

		myChart.setOption({
			series: getSeries(list, colors),
		})

		this.setState({ times: deepCopy(times), length: times.length })
	}
	renderLine = () => {
		let { dragCfg, times } = this.props
		if (!dragCfg) return null
		let { idx = 0 } = dragCfg
		let left  = idx / times.length * 100
		return <div className="ws-line" style={{ left: `${left}%` }}></div>
	}
	renderHelper = () => {
		return (
			<div className="ws-helper" style={{ width: this.state.length }}></div>
		)
	}
	render() {
		let { gridStyle = {}, width, multiple } = this.props
		let { options, length } = this.state
		let style  = { ...gridStyle, width: '100%', height: '100%' }
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
				{ this.renderLine() }
				{ /*this.renderHelper()*/ }
			</div>
		)
	}
}

// 创建x轴数据
function getCategory(times) {
	return times.map((timestamp, i) => {
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
			data: (data || []).map(({ value }) => value),
			lineStyle: {
				color: colors[i],
				width: 1,
			},
		}
	})
}

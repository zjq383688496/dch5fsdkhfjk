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
				data: getCategory(times),
				show: false,
			},
			yAxis: getYAxis(list),
			series: getSeries(list, colors),
			animation: false,
		}
		this.state = {
			options,
			length,
			gridH:  0,
			height: 0,
		}
	}
	componentDidMount() {
		this.init()
	}
	componentWillReceiveProps(props) {
		let { height } = props
		if (height === this.state.height) return
		this.setState({ height, gridH: Math.ceil(height / 5) })
	}
	init = () => {
		let { scrollCfg, onLoaded, height } = this.props
		let { wave } = this.refs
		if (!wave) return
		this.setState({ gridH: Math.ceil(height / 5) })
		if (scrollCfg && scrollCfg.scrollLeft) {
			wave.scrollLeft = scrollCfg.scrollLeft
		}
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
	renderLine = () => {
		let { dragCfg } = this.props
		if (!dragCfg) return null
		let { left = 0 } = dragCfg
		return <div className="ws-line" style={{ left }}></div>
	}
	render() {
		let { name, options, length } = this.state
		let line = this.renderLine()
		let style = { height: '100%', ...this.getGridStyle(), width: `${length}px`, }
		console.log(style)
		return (
			<div ref="wave" className="wave-stacked">
				<ReactEchartsCore
					ref={e => { if (e) this.echart = e }}
					echarts={echarts}
					notMerge={true}
					lazyUpdate={true}
					option={options}
					style={{style}}
				/>
				{ line }
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

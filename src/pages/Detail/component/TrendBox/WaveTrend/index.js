import React from 'react'
import './index.less'

import WaveBox from './WaveBox'

import Scrollbar from '@comp/Scrollbar'
import Select    from '@comp/Select'

import WaveTick  from './WaveTick'

const hours = [ 2, 4, 8, 12, 24, 24 * 7 ]

const nameList = [
	'PEAK', 'PPLAT', 'PMEAN', 'PEEP', '△P',
	'FIO2', 'ETCO2',
	'MVE', 'MVI',
	'TI', 'IE', 'TCE', 'TPLAT', 'RR', 'RRSPON',
	'VTE', 'VTI', 'VT/kg BW', 'PIF', 'PEF',
	'C', 'R', 'RSB',
]

const colors2 = ['#138988', '#3559d4', '#50d1cb']

export default class WaveTrend extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: {},
			hour: 24,
			scrollCfg: { scrollLeft: 0 },
			dragCfg: null,
			current: {},
			times: [],
		}
	}
	timeout = null
	componentDidMount() {
		this.getData()
	}
	componentWillUnmount() {
		clearInterval(this.timeout)
	}
	getData = async () => {
		let { hour } = this.state
		await _wait(100)
		let now = Date.now()
		let len = nameList.length
		let data = nameList.map((name, i) => {
			let value = ~~(100 / len * i * .96) + 5
			// console.log(name, ': ', value)
			return {
				name,
				min: 0,
				max: 100,
				data: new Array(hour * 60).fill().map((_, j) => {
					return {
						value,
						timestamp: 1607337000000 + j * 6e4
					}
				})
			}
		})
		let times = this.getTimes(data[0])
		let dataMap = {}
		data.forEach(_ => {
			dataMap[_.name] = _
		})
		this.setState({ data: dataMap, times })
		console.log('耗时: ', Date.now() - now, 'ms')
	}
	getTimes = (data = {}) => {
		if (!data) return []
		return data.data.map(_ => _.timestamp)
	}
	getDom1 = dom => {
		this.$dom1 = dom
	}
	getDom2 = dom => {
		this.$dom2 = dom
	}
	getDom3 = dom => {
		this.$dom3 = dom
	}
	scrollEnd = scrollCfg => {
		let { scrollLeft } = scrollCfg
		let { $dom1, $dom2, $dom3 } = this
		if ($dom1) $dom1.scrollLeft = scrollLeft
		if ($dom2) $dom2.scrollLeft = scrollLeft
		if ($dom3) $dom3.scrollLeft = scrollLeft
		this.setState({ scrollCfg })
	}
	onDrag = dragCfg => {
		if (!dragCfg) return this.setState({ current: {}, dragCfg })
		let { idx, ratio } = dragCfg
		let { data, times } = this.state
		let current = {}
		Object.values(data).map(_ => {
			current[_.name] = _.data[idx]
		})
		current.timestamp = times[idx]
		this.setState({ current, dragCfg })
	}
	render() {
		let { $dom1, $dom2, $dom3 } = this
		let { current, data, times, scrollCfg, dragCfg } = this.state
		if (!Object.keys(data).length) return null
		let $dom = $dom1 || $dom2
		let length = times.length
		let width  = $dom? $dom.clientWidth: 0
		return (
			<div className="wave-trend">
				<div className="wt-float">
				</div>
				<div className="wt-content">
					<WaveBox dom={$dom1} scrollCfg={scrollCfg} dragCfg={dragCfg} data={data} times={times} width={width} onLoaded={this.getDom1} onDrag={this.onDrag} cursor={current} />
					<WaveBox dom={$dom2} scrollCfg={scrollCfg} dragCfg={dragCfg} data={data} times={times} width={width} onLoaded={this.getDom2} onDrag={this.onDrag} colors={colors2} />
					<div className="wt-tick">
						{
							$dom
							? <WaveTick times={times} onLoaded={this.getDom3} width={width} />
							: null
						}
					</div>
				</div>
				<div className="wt-bottom">
					{
						length && $dom && length > $dom.clientWidth
						?
						<Scrollbar
							dom={$dom}
							step={80}
							type={'h'}
							scrollEnd={this.scrollEnd}
						/>
						: null
					}
				</div>
			</div>
		)
	}
}

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

export default class WaveTrend extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: {},
			hour: 24,
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
		// let item = {
		// 	min: 0,
		// 	max: 100,
		// 	data: new Array(hour * 60).fill().map((_, i) => {
		// 		return {
		// 			value: i * 5 + 10,
		// 			timestamp: 1607337000000 + i * 6e4
		// 		}
		// 	})
		// }
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
	scrollEnd = ({ scrollTop, scrollLeft, clientHeight, scrollHeight, clientWidth, scrollWidth }) => {
		let { $dom1, $dom2, $dom3 } = this
		if ($dom1) $dom1.scrollLeft = scrollLeft
		if ($dom2) $dom2.scrollLeft = scrollLeft
		if ($dom3) $dom3.scrollLeft = scrollLeft
	}
	render() {
		let { $dom1, $dom2, $dom3 } = this
		let { data, times } = this.state
		if (!Object.keys(data).length) return null
		let $dom = $dom1 || $dom2
		let length = times.length
		return (
			<div className="wave-trend">
				<div className="wt-float">
				</div>
				<div className="wt-content">
					<WaveBox data={data} times={times} cursor={1607337000000} onLoaded={this.getDom1} />
					<WaveBox colors={['#138988', '#3559d4', '#50d1cb']} data={data} times={times} onLoaded={this.getDom2} />
					<div className="wt-tick">
						{
							$dom
							? <WaveTick times={times} onLoaded={this.getDom3} width={$dom.clientWidth} />
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

import React from 'react'
import './index.less'

import WaveBox from './WaveBox'

const hours = [ 2, 4, 8, 12, 24, 24 * 7 ]

const nameList = [
	'PEAK', 'PPLAT', 'PMEAN', 'PEEP', '△P',
	'FIO2', 'ETCO2',
	'MVE', 'MVI',
	'TI', 'IE', 'TCE', 'TPLAT', 'RR', 'RRSPON',
	'C', 'R', 'RSB',
]

export default class WaveTrend extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
			hour: 24 * 7,
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
		let len  = nameList.length
		let item = {
			// name: 'ETCO2',
			data: new Array(hour * 60).fill().map((_, i) => {
				return {
					value: 1,
					timestamp: 1607337000000 + i * 6e4
				}
			})
		}
		let data = nameList.map(name => {
			let newItem = deepCopy(item)
			newItem.name = name
			return newItem
		})
		this.setState({ data }, this.getTimes)
		console.log('耗时: ', Date.now() - now, 'ms')
	}
	render() {
		let { data } = this.state
		if (!data.length) return null
		return (
			<div className="wave-trend">
				<div className="wt-float">
				</div>
				<div className="wt-content">
					<WaveBox data={data} />
					<WaveBox data={data} />
				</div>
				<div className="wt-bottom">
				</div>
			</div>
		)
	}
}

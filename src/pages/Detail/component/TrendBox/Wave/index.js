import React from 'react'
import './index.less'

import StaticWave from './StaticWave'

const hours = [ 2, 4, 6, 12, 24, 72 ]

export default class WaveBox extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
			hour: 2,
		}
	}
	timeout = null
	componentDidMount() {
		this.getData(2)
	}
	componentWillUnmount() {
		clearInterval(this.timeout)
	}
	getData = hour => {
		let { m } = __Map__
		this.setState({ data: [], hour })
		this.timeout = setTimeout(() => {
			let data = []
			Object.keys(m).forEach(key => {
				let val = m[key],
					da  = {
						key,
						name: val.n,
						unit: val.u,
						list: new Array(200).fill().map(_ => ({ value: randomRange(20, 30) })),
						minValue: 0,
						maxValue: 40,
					}
				data.push(da)
			})
			this.setState({ data })
		}, 500)
	}
	hourChange = hour => {
		if (this.state.hour === hour) return
		this.getData(hour)
	}
	renderWave = () => {
		let { data } = this.state
		return data.map((_, i) => {
			return <StaticWave key={i} data={_} />
		})
	}
	renderHour = () => {
		let { hour } = this.state
		return hours.map((_, i) => {
			return <a key={i} className={_ === hour? 's-active': ''} onClick={e => this.hourChange(_)}>{_}h</a>
		})
	}
	render() {
		let wave = this.renderWave()
		let hour = this.renderHour()
		let { year, month, date } = getDate()
		return (
			<div className="wave-box">
				<div className="wb-top">
					{year}-{month}-{date}
				</div>
				<div className="wb-content">
					{ wave }
				</div>
				<div className="wb-bottom">
					{ hour }
				</div>
			</div>
		)
	}
}

import React from 'react'
import './index.less'

import { Modal, Space } from 'antd'
import moment from 'moment'

import StaticWave from './StaticWave'
import DatePicker from './DatePicker'

const { floor } = Math
const list  = [ 'PAW', 'FLOW', 'VOLUME', 'CO2' ]
const left  = 60
const right = 10

export default class WaveBox extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data:     [],
			duration: 30,
			date:  moment(),
			limit: 200,
			lineShow: false,
			pageX: 0,
			current: [],
			visible: false,
		}
	}
	timeout = null
	componentDidMount() {
		this.getData(2)
	}
	componentWillUnmount() {
		clearInterval(this.timeout)
	}
	getData = () => {
		let { r } = __Map__
		this.setState({ data: [] })
		this.timeout = setTimeout(() => {
			let data = []
			list.forEach(key => {
				let val = r[key],
					da  = {
						key,
						name: val.n,
						unit: val.u,
						list: new Array(200).fill().map(_ => ({ value: randomRange(20, 30) })),
						minValue: 0,
						maxValue: 40,
						current: undefined,
					}
				data.push(da)
			})
			this.setState({ data })
		}, 500)
	}
	renderWave = height => {
		let { data, current } = this.state
		return data.map((_, i) => {
			let cur = current[i]
			return (
				<div key={i} className="wb-wave-box" style={{ height }}>
					<StaticWave left={left} right={right} ref={`wave_${_.key}`} data={_} />
					<div className="wb-data fs32 c-blue-d">{cur? cur.value: '--'}</div>
				</div>
			)
		})
	}
	onMouseMove = e => {
		let { data, limit } = this.state
		let { pageX, target } = e
		let current = []
		let startX = 20 + left,
			width  = target.offsetWidth - left - right,
			endX   = startX + width
		if (pageX < startX || pageX > endX) return this.setState({ pageX: 0, lineShow: false })
		let idx = floor((pageX - startX) / width * limit)
		data.forEach(_ => current.push(_.list[idx]))
		return this.setState({ data, pageX, lineShow: true, current })
	}
	setDate = () => {
		this.setState({ visible: true })
	}
	setCrop = () => {
		let { date } = this.state
		let { refs } = this
		let list = []
		let dateStr = date.format('YYYY-MM-DD HH:mm:ss')

		html2canvas(document.querySelector('.wb-scroll')).then(canvas => {
			let a = document.createElement('a')
			document.body.appendChild(a)
			// document.body.appendChild(canvas)
			a.download = `${dateStr}.png`
			a.href = canvas.toDataURL('image/png')
			a.click()
			document.body.removeChild(a)
			// document.body.removeChild(canvas)
		})
	}
	handleCancel = () => {
		this.setState({ visible: false })
	}
	handleOk = () => {
		let { datePicker } = this.refs
		this.setState({ visible: false, ...datePicker.state })
	}
	render() {
		let { lineShow, pageX, visible, date, duration } = this.state
		let style = { left: pageX - 20 }
		let { content } = this.refs
		let height = 0
		if (content) height = ~~(content.offsetHeight / 3)
		let wave = this.renderWave(height)
		let dateStr = date.format('YYYY-MM-DD HH:mm:ss')
		return (
			<div className="wave-review-box">
				<div className="wb-top fs24">
					<Space>
						{dateStr}
						{duration}秒
					</Space>
					<a className="icon-search" onClick={this.setDate}></a>
				</div>
				<div
					ref="content"
					className="wb-content"
					onMouseMove={this.onMouseMove}
				>
					<div className="wb-scroll" style={{ height: height * wave.length }}>
						<span className="time-point fs20">{dateStr}</span>
						{ wave }
						<div className={`wb-line${lineShow? ' s-active': ''}`} style={style}>
						</div>
					</div>
				</div>
				<div className="wb-bottom">
					<a className="icon-output" onClick={this.setCrop}></a>
				</div>
				<Modal
					title="时间设置"
					visible={visible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
				>
					{
						visible
						?
						<DatePicker ref="datePicker" date={date} duration={duration} />
						: null
					}
				</Modal>
			</div>
		)
	}
}

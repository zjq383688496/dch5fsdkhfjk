import React from 'react'
import './index.less'

import { Modal, Space } from 'antd'
import moment from 'moment'

import StaticWave from './StaticWave'
import DatePicker from './DatePicker'

import serviceApi from '@service/api'

const { floor } = Math
const list  = [ 'PAW', 'FLOW', 'VOLUME', 'CO2' ]
const left  = 60
const right = 10

const resMap = {
	flowList:   'FLOW',
	pawList:    'PAW',
	volumeList: 'VOLUME',
}

const dateFormat = 'YYYY-MM-DD HH:mm:ss'

export default class WaveBox extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data:     [],
			duration: 30,
			date:  moment(),	// moment('2020-10-20 22:00:00'),
			limit: 0,
			lineShow: false,
			pageX: 0,
			current: [],
			visible: false,
		}
	}
	timeout = null
	componentDidMount() {
		this.getData()
	}
	componentWillUnmount() {
		// clearInterval(this.timeout)
	}
	getData = () => {
		let { r } = __Map__
		let { device } = this.props,
			{ date } = this.state,
			{ macAddress } = device
		this.setState({ data: [] })
		serviceApi.report(macAddress, date.format(dateFormat)).then((res = {}) => {
			let data = []
			Object.keys(res).forEach(k => {
				let item = res[k],
					key  = resMap[k],
					val  = r[key]
				if (!item || !item.dataList || !item.dataList.length) return
				let da  = {
					key,
					name: val.n,
					unit: val.u,
					list: item.dataList || [],
					minValue: item.min || 0,
					maxValue: item.max || 100,
					current: undefined,
				}
				data.push(da)
			})
			let cfg = { data }
			if (data.length) cfg.limit = data[0].list.length
			this.setState(cfg)
		})
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
		let dateStr = date.format(dateFormat)

		html2canvas(document.querySelector('.wb-scroll')).then(canvas => {
			let a = document.createElement('a')
			document.body.appendChild(a)
			a.download = `${dateStr}.png`
			a.href = canvas.toDataURL('image/png')
			a.click()
			document.body.removeChild(a)
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
		let { lineShow, pageX, visible, current, date, duration } = this.state
		let style = { left: pageX - 20 }
		let { content } = this.refs
		let height = 0
		if (content) height = ~~(content.offsetHeight / 3)
		let wave = this.renderWave(height)
		let dateStr = date.format(dateFormat)
		let currentDate = ''
		if (current.length) {
			let first = current[0]
			if (first && first.timestamp) {
				currentDate = moment(new Date(first.timestamp)).format(dateFormat)
			}
		}
		return (
			<div className="wave-review-box">
				<div className="wb-top fs24">
					<Space>
						{dateStr}
						{duration}秒
					</Space>
					<a className="icons-search" onClick={this.setDate}></a>
				</div>
				<div
					ref="content"
					className="wb-content"
					onMouseMove={this.onMouseMove}
				>
					<div className="wb-scroll" style={{ height: height * wave.length }}>
						<span className="time-point fs20">{currentDate}</span>
						{ wave }
						<div className={`wb-line${lineShow? ' s-active': ''}`} style={style}>
						</div>
					</div>
				</div>
				<div className="wb-bottom">
					<a className="icons-output" onClick={this.setCrop}></a>
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


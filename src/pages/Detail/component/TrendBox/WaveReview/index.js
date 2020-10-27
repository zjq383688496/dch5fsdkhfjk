import React from 'react'
import './index.less'

import { Modal, Space, Button, message } from 'antd'
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
			date:  moment(Date.now() - 3e4),	// 默认当前时刻前30s波形
			limit: 0,
			lineShow: false,
			dragState: false,
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
	// 时间跳跃
	dateJump = s => {
		let { date } = this.state
		let ds = s * 1000
		let ms = new Date(date._d) * 1 + ds
		let mx = Date.now() - 3e4
		console.log(ms, Date.now() - ds)
		if (ms > mx) return
		date.add(ds)
		this.setState({ date }, this.getData)
	}
	getData = () => {
		let { r } = __Map__
		let { device } = this.props,
			{ date } = this.state,
			{ macAddress } = device
		this.setState({ data: [], lineShow: false })
		serviceApi.report(macAddress, date.format(dateFormat)).then((res = {}) => {
			let newRes = {}
			if (res.pawList)    newRes.pawList    = res.pawList
			if (res.flowList)   newRes.flowList   = res.flowList
			if (res.volumeList) newRes.volumeList = res.volumeList
			let data = []
			Object.keys(newRes).forEach(k => {
				let item = newRes[k],
					key  = resMap[k],
					val  = r[key]
				if (!item || !item.dataList || !item.dataList.length) return
				let da  = {
					key,
					name: val.n,
					unit: val.u,
					list: item.dataList || [],
					minValue: item.min || 0,
					maxValue: item.max,
					current: undefined,
				}
				data.push(da)
			})
			let cfg = { data, lineShow: false }
			if (data.length) cfg.limit = data[0].list.length
			console.log(data.length)
			this.setState(cfg)
		})
	}
	// 拖拽开启
	onMouseDown = e => {
		this.setState({ dragState: true, lineShow: true })
	}
	// 拖拽中
	onMouseMove = e => {
		let { data, limit, dragState } = this.state
		if (!dragState) return
		let { content } = this.refs
		let { pageX } = e
		let current = []
		let startX = 20 + left,
			width  = content.offsetWidth - left - right,
			endX   = startX + width
		if (pageX < startX || pageX > endX) {
			if (pageX > endX) console.log('大于结束点')
			return this.setState({ pageX: 0, lineShow: false })
		}
		let idx = floor((pageX - startX) / width * limit)
		data.forEach(_ => current.push(_.list[idx]))
		return this.setState({ data, pageX, lineShow: true, current })
	}
	// 拖拽关闭
	onMouseUp = e => {
		this.setState({ dragState: false })
	}
	setDate = () => {
		this.setState({ visible: true })
	}
	setCrop = () => {
		let { data, date } = this.state
		let { refs } = this
		let list = []
		if (!data.length) return message.warning('无波形数据!')
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
		this.setState({ visible: false, ...datePicker.state }, this.getData)
	}
	// 渲染波形
	renderWave = (height, style, lineShow) => {
		let { data, current } = this.state
		let { r } = __Map__
		return data.map((_, i) => {
			let cur = current[i]
			let { key, maxValue, minValue } = _
			let val = r[key]
			let percentage, newVal
			if (cur) {
				percentage = getPercentage(cur.value, minValue, maxValue - minValue)
				if (key === 'VOLUME') newVal = cur.value.toFixed(0)
				else newVal = cur.value.toFixed(1)
			}
			return (
				<div key={i} className="wb-wave-box" style={{ height }}>
					<StaticWave left={left} field={key} right={right} ref={`wave_${key}`} data={_} />
					{
						lineShow && cur
						?
						<>
							<div className="wb-data fs24" style={style}>
								<b className="quota-c">{val.n}</b>
								<span className="quota-uc" style={{color: '#333' }}>{cur? newVal: '--'}</span>
							</div>
							{
								cur.value != 0
								?
								<div className="wb-point" style={style}>
									<div className="wb-point-dot">
										<i className="wb-point-dot" style={{ bottom: `${percentage}%`}}></i>
									</div>
								</div>
								: null
							}
						</>
						: null
					}
				</div>
			)
		})
	}
	render() {
		let { dragState, lineShow, pageX, visible, current, date, duration } = this.state
		let style = { left: pageX - 20 }
		let { content } = this.refs
		let height = 0
		if (content) height = ~~(content.offsetHeight / 3)
		let wave = this.renderWave(height, style, lineShow)
		let dateStr = date.format(dateFormat)
		let currentDate = ''
		if (current.length) {
			let first = current[0]
			if (first && first.timestamp) {
				let curDate = new Date(first.timestamp)
				currentDate = moment(curDate).format('HH:mm:ss:') + moment(curDate).millisecond()
			}
		}
		return (
			<div className="wave-review-box">
				<div className="wb-top fs24">
					{dateStr}
					<Space>
						<Button size="small" onClick={e => this.dateJump(-duration)}>← {duration}s</Button>
						<Button size="small" onClick={e => this.dateJump(duration)} style={{ marginRight: 40 }}>{duration}s →</Button>
						<a className="icons-search" onClick={this.setDate}></a>
					</Space>
				</div>
				<div
					ref="content"
					className="wb-content"
					onMouseDown={this.onMouseDown}
				>
					<div className="wb-scroll" style={{ height: height * wave.length }}>
						{ wave }
						<div className={`wb-line${lineShow? ' s-active': ''}`} style={style}>
							<span className="time-point fs24 c-blue-d">{currentDate}</span>
						</div>
					</div>
				</div>
				<div className="wb-bottom">
					<a className="icons-camera" onClick={this.setCrop}></a>
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
				{
					dragState
					? 
					<div
						className="rw-mask"
						onMouseMove={this.onMouseMove}
						onMouseUp={this.onMouseUp}
						onMouseOut={this.onMouseUp}
					></div>
					: null
				}
			</div>
		)
	}
}


function getPercentage(val, start, distance) {
	let percentage = (val - start) / distance
	return percentage * 100
}

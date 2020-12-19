import React from 'react'
import './index.less'

import { Modal, Space, Button, message } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import moment from 'moment'

import StaticWave from './StaticWave'
import DatePicker from './DatePicker'

import serviceApi from '@service/api'

const { floor } = Math
const list  = [ 'PAW', 'FLOW', 'VOLUME', 'CO2' ]
const left  = 50
const right = 0

const resMap = {
	flowList:   'FLOW',
	pawList:    'PAW',
	volumeList: 'VOLUME',
}

const oneHour = 3600 * 1000

const dateFormat = 'YYYY-MM-DD HH:mm:ss'

export default class WaveBox extends React.Component {
	constructor(props) {
		super(props)
		let duration = 30
		this.state = {
			data:     [],
			duration,
			date:  moment(Date.now() - 4e4),	// 默认当前时刻前40s波形
			limit: duration * 10,
			lineShow: false,
			dragState: false,
			recordState: false,
			pageX: 0,
			current: [],
			visible: false,
			hours: 72,
		}
	}
	componentDidMount() {
		this.getData()
	}
	componentWillUnmount() {}
	// 时间跳跃
	dateJump = s => {
		let { date } = this.state
		let ds = s * 1000
		let ms = new Date(date._d) * 1 + ds
		let mx = Date.now() - 3e4
		if (ms > mx) return
		date.add(ds)
		this.setState({ date }, this.getData)
	}
	getData = () => {
		let { r } = __Map__
		let { device } = this.props,
			{ date, limit } = this.state,
			{ macAddress } = device
		this.setState({ data: [], lineShow: false })
		serviceApi.getReview(macAddress, date.format(dateFormat)).then((res = {}) => {
			let newRes = {}
			if (res.pawList)    newRes.pawList    = res.pawList
			if (res.flowList)   newRes.flowList   = res.flowList
			if (res.volumeList) newRes.volumeList = res.volumeList
			let data = []
			Object.keys(newRes).forEach(k => {
				let item = newRes[k],
					key  = resMap[k],
					val  = r[key]
				if (!item || !item.dataList) return
				let da  = {
					key,
					name: val.n,
					unit: val.u,
					list: item.dataList || [],
					minValue: getMinValue(item.min, key),
					maxValue: getMaxValue(item.max),
					current: undefined,
				}
				let len = da.list.length
				if (len < limit) da.list.push(...new Array(limit - len).fill(null))
				data.push(da)
			})
			let cfg = { data, lineShow: false }
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
			width  = content.offsetWidth - left - right - 110,
			endX   = startX + width
		if (pageX < startX || pageX > endX) {
			return this.setState({ pageX: 0, lineShow: false })
		}
		let idx = floor((pageX - startX) / width * (limit + 1))
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
	setCrop = async () => {
		let { data, date } = this.state
		let { refs } = this
		let list = []
		if (!data.length) return message.warning('无波形数据!')
		this.setState({ recordState: true })
		await _wait(100)
		html2canvas(document.querySelector('.wave-review-box')).then(canvas => {
			let a = document.createElement('a')
			document.body.appendChild(a)
			a.download = `${this.getCurrentDate()}.jpg`
			a.href = canvas.toDataURL('image/jpeg')
			a.click()
			document.body.removeChild(a)
			this.setState({ recordState: false })
		})
	}
	handleCancel = () => {
		this.setState({ visible: false })
	}
	handleOk = () => {
		let { datePicker } = this.refs
		this.setState({ visible: false, ...datePicker.state }, this.getData)
	}
	getCurrentDate = () => {
		let { current, date } = this.state,
			dateStr = date.format(`${dateFormat}:${date.millisecond()}`).replace(/[\s\:]/g, '_')
		if (!current.length) return dateStr
		let [ first ] = current
		if (first && first.timestamp) {
			let curDate = moment(new Date(first.timestamp))
			dateStr = curDate.format(`${dateFormat}:${curDate.millisecond()}`).replace(/[\s\:]/g, '_')
		}
		return dateStr
	}
	// 渲染波形
	renderWave = (style, lineShow) => {
		let { data, current } = this.state
		let { r } = __Map__
		return data.map((_, i) => {
			let cur = current[i]
			let { key, maxValue, minValue } = _
			let val = r[key]
			let percentage, newVal
			if (cur) {
				let value  = cur.value
				percentage = getPercentage(cur.value, minValue, maxValue - minValue)
				if (value) {
					if (key === 'VOLUME') newVal = value.toFixed(0)
					else newVal = value.toFixed(1)
				} else {
					newVal = '--'
				}
			}
			let isZero = parseFloat(newVal) == 0
			return (
				<div key={i} className="wb-wave-box">
					<StaticWave left={left} field={key} right={right} ref={`wave_${key}`} data={_} />
					<div className="wb-data fs28">
						<b className="quota-c">{lineShow && cur? newVal: '--'}</b>
					</div>
					{
						lineShow && cur
						?
						<>
							{
								parseFloat(cur.value) != 0
								?
								<div className="wb-point" style={style}>
									<div className="wb-point-dot">
										{
											!isZero
											? <i className="wb-point-dot" style={{ bottom: `${percentage}%`}}></i>
											: null
										}
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
		let { device, bedName } = this.props
		let { patientName, code } = device
		let { dragState, recordState, lineShow, pageX, visible, current, date, duration, hours } = this.state
		let style = { left: pageX - 20 }
		let height = 0
		let nowTime  = Date.now()
		let dateTime = new Date(date._d) * 1
		let prevTime = nowTime - hours * oneHour
		let wave = this.renderWave(style, lineShow)
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
					<a className="icons-search" onClick={this.setDate}></a>
				</div>
				<div className="wb-content">
					<div className="wb-timeline">
						<div className="wb-timeline-bar">
							{ new Array(duration / 5 + 1).fill().map((_, i) => <i key={i}></i>) }
							<span>{duration + 's'}</span>
						</div>
						<a className="wb-timeline-btn" onClick={e => this.dateJump(-duration)} disabled={dateTime < prevTime}><ArrowLeftOutlined /></a>
						<a className="wb-timeline-btn" onClick={e => this.dateJump(duration)} disabled={nowTime - dateTime < 7e4}><ArrowRightOutlined /></a>
					</div>
					<div
						ref="content"
						className="wb-scroll"
						onMouseDown={this.onMouseDown}
					>
						{ wave }
						<div className={`wb-line${lineShow? ' s-active': ''}`} style={{ ...style, top: 26 }}>
							<span className="time-point">{currentDate}</span>
							<i></i>
						</div>
					</div>
				</div>
				<div className="wb-bottom">
					{
						recordState
						?
						<Space size={80} className="fs24">
							<span>姓名: {patientName}</span>
							<span>床号: {bedName}</span>
							<span>入院号: </span>
							<span style={{ marginRight: 20 }}>设备: {code}</span>
						</Space>
						: null
					}
					{ !recordState? <a onClick={this.setCrop}>截屏</a>: null }
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
						<DatePicker ref="datePicker" hours={hours} date={date} duration={duration} />
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

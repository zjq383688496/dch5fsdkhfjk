import React from 'react'
import './index.less'

import { DatePicker, TimePicker, Select, Space, Row, Col, Form } from 'antd'
import moment from 'moment'

const { Option } = Select
const { Item }   = Form

const options = [
	{ value: 10 },
	{ value: 20 },
	{ value: 30 },
	{ value: 60 },
]

const layout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 18,
	},
}

const fDate = 'YYYY-MM-DD'
const fTime = 'HH:mm:ss'

const oneHour = 3600 * 1000

export default class DatePickerComp extends React.Component {
	constructor(props) {
		super(props)

		let { date, duration, hours } = props

		let prevDate = moment(Date.now() - oneHour * hours)
		this.state = {
			now: moment(),
			date,
			prevDate,
			duration,
		}
	}
	onChangeDate = m => {
		let { date } = this.state
		let d = m.format(fDate)
		let t = date.format(fTime)
		this.setState({ date: moment(d + ' ' + t) })
	}
	onChangeTime = m => {
		let { date } = this.state
		let d = date.format(fDate)
		let t = m.format(fTime)
		this.setState({ date: moment(d + ' ' + t) })
	}
	onChangeDuration = duration => {
		this.setState({ duration })
	}
	disabledDate = current => {
		let { date, now, prevDate } = this.state
		if (!current) return false
		return current < moment(prevDate.format(fDate)) || current > now
	}
	disabledHours = () => {
		let { date, now, prevDate } = this.state
		let hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
		if (date.format(fDate) === prevDate.format(fDate)) {
			let prevHour = prevDate.hour()
			hours = hours.filter(h => h < prevHour)
			return hours
		}
		if (date.format(fDate) === now.format(fDate)) {
			let nowHour = now.hour()
			hours = hours.filter(h => h > nowHour)
			return hours
		}
		return []
	}
	render() {
		let { date = moment(), duration = 30 } = this.state
		return (
			<div className="date-picker-comp">
				<Form {...layout}>
					<Item label="选择时刻">
						<Space>
							<DatePicker value={date} disabledDate={this.disabledDate} format={fDate} allowClear={false} onChange={this.onChangeDate} />
							<TimePicker value={date} disabledHours={this.disabledHours} format={fTime} allowClear={false} onChange={this.onChangeTime} showNow={false} />
						</Space>
					</Item>
					{/*<Item label="时长">
						<Space>
							<Select value={duration} onChange={this.onChangeDuration}>
								{
									options.map(({ name, value }, i) => {
										return <Option key={i} value={value}>{value} 秒</Option>
									})
								}
							</Select>
						</Space>
					</Item>*/}
				</Form>
			</div>
		)
	}
}

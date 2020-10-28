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

const hoursLimit = 72
const oneDay = 24 * 3600 * 1000

export default class DatePickerComp extends React.Component {
	constructor(props) {
		super(props)

		let { date, duration } = props

		let prevDate = moment(new Date(date._d) - oneDay)
		this.state = {
			date,
			prevDate,
			duration,
		}
	}
	onChangeDate = m => {
		let { date } = this.state
		let d = m.format('YYYY-MM-DD')
		let t = date.format('HH:mm:ss')
		this.setState({ date: moment(d + ' ' + t) })
	}
	onChangeTime = m => {
		let { date } = this.state
		let d = date.format('YYYY-MM-DD')
		let t = m.format('HH:mm:ss')
		this.setState({ date: moment(d + ' ' + t) })
	}
	onChangeDuration = duration => {
		this.setState({ duration })
	}
	disabledDate = current => {
		let { date, prevDate } = this.state
		if (!current) return false
		return current < prevDate || current > date
	}
	render() {
		let { date = moment(), duration = 30 } = this.state
		return (
			<div className="date-picker-comp">
				<Form {...layout}>
					<Item label="选择时刻">
						<Space>
							<DatePicker value={date} format={'YYYY-MM-DD'} allowClear={false} onChange={this.onChangeDate} />
							<TimePicker value={date} format={'HH:mm:ss'} allowClear={false} onChange={this.onChangeTime} showNow={false} />
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

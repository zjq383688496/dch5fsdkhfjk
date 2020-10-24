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

export default class DatePickerComp extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			date:     props.date,
			duration: props.duration,
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
	render() {
		let { date = moment(), duration = 30 } = this.state
		return (
			<div className="date-picker-comp">
				<Form {...layout}>
					<Item label="选择时刻">
						<Space>
							<DatePicker value={date} format={'YYYY-MM-DD'} onChange={this.onChangeDate} />
							<TimePicker value={date} format={'HH:mm:ss'} onChange={this.onChangeTime} showNow={false} />
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

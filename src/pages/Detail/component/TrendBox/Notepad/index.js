import React from 'react'
import './index.less'

export default class NotepadBox extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
		}
	}
	timeout = null
	componentDidMount() {
		this.getData()
	}
	componentWillUnmount() {
		clearInterval(this.timeout)
	}
	getData = () => {
		this.timeout = setTimeout(() => {
			let data = new Array(40).fill().map((_, i) => {
				return {
					priority: 1,
					message: 'VT High',
					timestamp: Date.now(),
				}
			})
			data.forEach(_ => {
				let { timestamp } = _,
					{ year, month, date, hour, minu } = getDate(new Date(timestamp))
				_.date = `${year}${month}${date}`
				_.time = `${hour}${minu}`
			})
			this.setState({ data })
		}, 500)
	}
	renderTd = () => {
		let { data } = this.state
		return data.map((_, i) => {
			let { date, time, priority, message } = _
			return (
				<tr key={i}>
					<td>{date}</td>
					<td>{time}</td>
					<td>{priority}</td>
					<td>{message}</td>
				</tr>
			)
		})
	}
	render() {
		let td = this.renderTd()
		return (
			<div className="notepad-box">
				<table>
					<colgroup>
						<col style={{ width: 90 }}/>
						<col style={{ width: 70 }}/>
						<col style={{ width: 50 }}/>
						<col />
					</colgroup>
					<tbody>
						<tr>
							<th>日期</th>
							<th>时间</th>
							<th>优先</th>
							<th>事件/报警</th>
						</tr>
						{td}
					</tbody>
				</table>
			</div>
		)
	}
}

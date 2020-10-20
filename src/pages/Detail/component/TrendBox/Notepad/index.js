import React from 'react'
import './index.less'

import {
	StepBackwardOutlined,
	StepForwardOutlined,
	CaretLeftOutlined,
	CaretRightOutlined
} from '@ant-design/icons'

export default class NotepadBox extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
			pos:  'top',
		}
	}
	timeout = null
	componentDidMount() {
		let { table } = this.refs
		this.getData()
		table.addEventListener('scroll', this.scrollUpdate.bind(this), false)
	}
	componentWillUnmount() {
		let { table } = this.refs
		clearInterval(this.timeout)
		table.removeEventListener('scroll', this.scrollUpdate)
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
	scrollUpdate = () => {
		let pos = ''
		let { table } = this.refs
		let ch = table.clientHeight
		let sh = table.scrollHeight
		let st = table.scrollTop
		if (st === 0) pos = 'top'
		else if ((st + ch) >= sh) pos = 'bottom'
		this.setState({ pos })
	}
	scrollTo = num => {
		let { table } = this.refs
		let st = table.scrollTop
		table.scrollTop = st + num
		this.scrollUpdate()
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
	renderCol() {
		return (
			<colgroup>
				<col style={{ width: 90 }}/>
				<col style={{ width: 70 }}/>
				<col style={{ width: 50 }}/>
				<col />
			</colgroup>
		)
	}
	render() {
		let { pos } = this.state
		let td  = this.renderTd()
		let col = this.renderCol()
		return (
			<div className="notepad-box">
				<div className="nb-top">
					<div className="nb-table">
						<div className="nb-table-header">
							<table>
								{ col }
								<tbody>
									<tr>
										<th>日期</th>
										<th>时间</th>
										<th>优先</th>
										<th>事件/报警</th>
									</tr>
								</tbody>
							</table>
						</div>
						<div ref="table" className="nb-table-body">
							<table>
								{ col }
								<tbody>
									{td}
								</tbody>
							</table>
						</div>
					</div>
					<div className="nb-scroll">
						<div className="nb-scroll-content">
							<a className="btn-scroll bs-top"    disabled={pos === 'top'} onClick={e => this.scrollTo(-9999)}><StepBackwardOutlined/></a>
							<a className="btn-scroll"           disabled={pos === 'top'} onClick={e => this.scrollTo(-50)}><CaretLeftOutlined/></a>
							<div className="scroll-bar"></div>
							<a className="btn-scroll"           disabled={pos === 'bottom'} onClick={e => this.scrollTo(50)}><CaretRightOutlined/></a>
							<a className="btn-scroll bs-bottom" disabled={pos === 'bottom'} onClick={e => this.scrollTo(9999)}><StepForwardOutlined/></a>
						</div>
					</div>
				</div>
				<div className="nb-bottom">
					<a className="icons-output"></a>
				</div>
			</div>
		)
	}
}

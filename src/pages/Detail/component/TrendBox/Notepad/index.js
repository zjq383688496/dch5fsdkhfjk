import React from 'react'
import './index.less'

import {
	StepBackwardOutlined,
	StepForwardOutlined,
	CaretLeftOutlined,
	CaretRightOutlined
} from '@ant-design/icons'
import moment from 'moment'
import serviceApi from '@service/api'

const dateFormat = 'YYYY-MM-DD HH:mm:ss'

export default class NotepadBox extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			date:  moment().format(dateFormat),
			pos:  'top',
			current: 1,
			page: 1,
			size: 30,
			data: [],
			loading: false,
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
		// clearInterval(this.timeout)
		table.removeEventListener('scroll', this.scrollUpdate)
	}
	getHref = () => {
		let { device } = this.props,
			{ date }   = this.state,
			{ macAddress } = device
		let href = serviceApi.export(macAddress, date, 1)
		return href
	}
	getData = () => {
		let { device } = this.props,
			{ data, date, current, size, page, pages, loading } = this.state,
			{ macAddress } = device
		if (pages === page || loading) return
		this.setState({ loading: true })
		serviceApi.getAlarm(macAddress, date, current, size, 1).then(res => {
			let { pages, records } = res
			this.setState({
				page: page + 1,
				current: current + size,
				data: [ ...data, ...records ],
				loading: false,
			}, this.scrollUpdate)
		}).catch(e => {
			this.setState({ loading: false })
		})
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
		if (pos === 'bottom') this.getData()
		console.clear()
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
			let { date, time, priority, message } = _,
				cls = `a${priority}`
			return (
				<tr key={i}>
					<td>{date}</td>
					<td>{time}</td>
					<td className={cls}>{new Array(4-priority).fill('!')}</td>
					<td className={cls}>{message}</td>
				</tr>
			)
		})
	}
	renderCol() {
		return (
			<colgroup>
				<col style={{ width: 100 }}/>
				<col style={{ width: 80 }}/>
				<col style={{ width: 40 }}/>
				<col />
			</colgroup>
		)
	}
	render() {
		let { table } = this.refs
		let { pos } = this.state
		let td   = this.renderTd()
		let col  = this.renderCol()
		let href = this.getHref()
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
							<a className="btn-scroll bs-top"    disabled={pos === 'top'} onClick={e => this.scrollTo(-999999)}><StepBackwardOutlined/></a>
							<a className="btn-scroll"           disabled={pos === 'top'} onClick={e => this.scrollTo(-50)}><CaretLeftOutlined/></a>
							<div className="scroll-bar"></div>
							<a className="btn-scroll"           disabled={pos === 'bottom' || isOnePage(table)} onClick={e => this.scrollTo(50)}><CaretRightOutlined/></a>
							<a className="btn-scroll bs-bottom" disabled={pos === 'bottom' || isOnePage(table)} onClick={e => this.scrollTo(999999)}><StepForwardOutlined/></a>
						</div>
					</div>
				</div>
				<div className="nb-bottom">
					{<a className="icons-output" target="_blank" href={href}></a>}
				</div>
			</div>
		)
	}
}

// 是否只有一页
function isOnePage(dom) {
	if (!dom) return true
	let ch = dom.clientHeight
	let sh = dom.scrollHeight
	return ch === sh
}

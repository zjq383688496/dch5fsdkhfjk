import React from 'react'
import './index.less'

import { Input, Button, Space, message } from 'antd'
import { DeleteFilled, EditFilled } from '@ant-design/icons'

import DeviceItem from '../DeviceItem'

export default class DropItem extends React.Component {
	constructor(props) {
		super(props)
		let { idx } = props
		let bedName = __BedName__[idx]
		this.state = {
			editState: false,
			bedName,
		}
	}
	componentDidMount() {
	}
	onStop = e => {
		e.preventDefault()
	}
	onFinish = (e, idx) => {
		let { bedName }  = this.state
		if (this.isRe(bedName, idx)) {
			return message.error('床位名称重复!')
		}
		__BedName__[idx] = bedName
		this.setState({ editState: false })
	}
	onEdit = e => {
		this.setState({ editState: true })
	}
	onMouseOut = e => {
		// e.preventDefault()
		// e.stopPropagation()
		let { currentTarget, target } = e
		if (target.className != 'di-btn') return
		let { idx } = this.props
		let bedName = __BedName__[idx]
		this.setState({ bedName, editState: false })
		console.log('onMouseOut')
	}
	update = (config, idx) => {
		// let { bedName } = config
		this.setState(config)
		// if (this.isRe(bedName, idx)) {
		// 	return message.error('床位名称重复!')
		// }
		// __BedName__[idx] = bedName
	}
	isRe(name, idx) {
		if (!name || __BedName__[idx] === name) return false
		let jg = false
		Object.keys(__BedName__).forEach(i => {
			if (i === idx) return
			if (__BedName__[i] === name) {
				jg = true
			}
		})
		return jg
	}
	render() {
		let { editState, bedName } = this.state
		let { data, onDrop, onRemove, idx } = this.props
		return (
			<div
				className="drop-item"
				onDragStart={this.onStop}
				onDragEnter={this.onStop}
				onDragLeave={this.onStop}
				onDragOver={this.onStop}
				onDrop={e => onDrop(e, idx)}
				onMouseOut={this.onMouseOut}
				draggable="true"
			>
				<div className="bad-name">{__BedName__[idx]}</div>
				<DeviceItem data={data} />
				<div className="di-btn">
					{
						data
						?
						<div className="di-remove" onClick={e => onRemove(e, idx)}><DeleteFilled /></div>
						:
						editState
						?
						<Space>
							<Input
								value={bedName}
								className="cb-item"
								placeholder="请输入床位"
								onChange={e => this.update({ bedName: e.target.value })}
							/>
							<Button type="primary" onClick={e => this.onFinish(e, idx)}>完成</Button>
						</Space>
						:
						<div className="di-edit" onClick={this.onEdit}><EditFilled /></div>
					}
				</div>
			</div>
		)
	}
}
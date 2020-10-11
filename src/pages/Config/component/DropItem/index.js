import React from 'react'
import './index.less'

import { Input, Button, Space } from 'antd'
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
		__BedName__[idx] = bedName
		this.setState({ editState: false })
	}
	onEdit = e => {
		this.setState({ editState: true })
	}
	update = config => {
		this.setState(config)
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
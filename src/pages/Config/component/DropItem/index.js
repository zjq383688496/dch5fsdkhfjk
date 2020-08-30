import React from 'react'
import './index.less'

import { DeleteFilled } from '@ant-design/icons'

import DeviceItem from '../DeviceItem'

export default class DropItem extends React.Component {
	constructor(props) {
		super(props)
	}
	componentDidMount() {
	}
	onStop = e => {
		e.preventDefault()
	}
	render() {
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
				<DeviceItem data={data} />
				{
					data
					? <div className="di-remove" onClick={e => onRemove(e, idx)}><DeleteFilled /></div>
					: null
				}
			</div>
		)
	}
}
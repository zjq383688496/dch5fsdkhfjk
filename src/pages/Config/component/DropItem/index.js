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
	onDragEnter = e => {
		e.preventDefault()
	}
	onDragLeave = e => {
		e.preventDefault()
	}
	onDragOver = e => {
		e.preventDefault()
	}
	render() {
		let { data, onDrop, onRemove, idx } = this.props
		return (
			<div
				className="drop-item"
				onDragEnter={this.onDragEnter}
				onDragLeave={this.onDragLeave}
				onDragOver={this.onDragEnter}
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
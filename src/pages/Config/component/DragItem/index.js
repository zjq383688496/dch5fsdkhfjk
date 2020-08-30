import React from 'react'
import './index.less'

import DeviceItem from '../DeviceItem'

export default class DragItem extends React.Component {
	constructor(props) {
		super(props)
	}
	componentDidMount() {
	}
	render() {
		let { data, onDragStart } = this.props
		if (!data) return null
		let { id } = data
		return (
			<div
				className="drag-item"
				onDragStart={e => onDragStart(e, id)}
				draggable="true"
			>
				<DeviceItem data={data} />
			</div>
		)
	}
}
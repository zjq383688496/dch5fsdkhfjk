import React from 'react'
import './index.less'

const statusMap = {
	UNREGISTER: '未注册',
    OFFLINE:    '离线',
    RUNNING:    '运行',
    STAND_BY:   '待机',
    DISCONNECT: '无连接'
}

export default class DeviceItem extends React.Component {
	constructor(props) {
		super(props)
	}
	componentDidMount() {
	}
	render() {
		let { data } = this.props
		if (!data) return <div className="device-item device-item-none"></div>
		let { id, name, runtimeStatus = '', code, departmentName, positionName } = data
		return (
			<div className="device-item fx-col">
				<h2 className="row-10 ellipsis">{name}</h2>
				<p className="row-6">{code}</p>
				<div className="fx row-6">
					<span className="col-12">{departmentName}</span>
					<span className="col-12">{positionName}</span>
				</div>
				<div className={`di-status`}>
					<div className={`di-status-${runtimeStatus}`}></div>
					{statusMap[runtimeStatus]}
				</div>
			</div>
		)
	}
}
import React from 'react'
import './index.less'

import { Input, Button, Select } from 'antd'
const { Option } = Select

import { WS } from '@service'
import Footer from '@comp/Footer'
import DragItem from './component/DragItem'
import DropItem from './component/DropItem'

import serviceApi from '@service/api'

import logo from 'assets/image/logo.png'

export default class Config extends React.Component {
	constructor(props) {
		super(props)

		// let { devices, deviceIndex, options } = this.getDevices()
		this.state = {
			// devices,
			// deviceIndex,
			// devicesFull: devices,
			devices: [],
			deviceIndex: {},
			devicesFull: [],
			grids: [],
			gridIndex: {},
			// options,
			options: {},
			search: {
				terminal: '',
				room:     '',
			}
		}
	}
	componentDidMount() {
		wsClear()
		this.getDevices(this.getGrid)
	}
	max = randomRange(90, 130)
	// 参数变更
	updateSearch = (config = {}) => {
		let { search } = this.state
		Object.assign(search, config)
		this.setState({ search }, this.deviceFilter)
	}
	// 获取设备
	getDevices = cb => {
		if (!__User__) return
		let deviceIndex = {}
		let options = {}
		serviceApi.devices().then(devices => {
			devices.forEach(device => {
				let { id, departmentName } = device
				deviceIndex[id] = device
				options[departmentName] = departmentName
			})
			this.setState({ devices, devicesFull: devices, deviceIndex, options }, cb)
		})
	}
	// 获取配置
	getGrid = () => {
		if (!__User__) return
		let { deviceIndex } = this.state
		let { dashboardId } = __User__
		serviceApi.dashboards(dashboardId).then(({ config }) => {
			let gridIndex = {}
			if (/^[\d,]+$/.test(config)) {
				config = config.split(',').map(_ => {
					let id = +_
					let obj = {}
					obj[id] = ''
					return obj
				})
			} else {
				config = JSON.parse(config)
			}
			let grids = config.map((item, i) => {
				if (!item) {
					__BedName__[i] = ''
					return
				}
				let id = +Object.keys(item)[0]

				if (isNaN(id)) return

				__BedName__[i] = item[id]

				if (id && !gridIndex[id]) {
					let device = deviceIndex[id]
					gridIndex[id] = device
					return device
				}
			})
			this.setState({ grids, gridIndex }, this.deviceFilter)
		})
	}
	// 过滤设备列表
	deviceFilter = () => {
		let { devicesFull, gridIndex, search } = this.state,
			{ terminal: _terminal, room: _room } = search
		let devices = deepCopy(devicesFull)
		devices = devices.filter(({ id, status }) => !gridIndex[id] && !!status)
		if (_terminal) devices = devices.filter(({ positionName }) => new RegExp(_terminal).test(positionName))
		if (_room)     devices = devices.filter(({ departmentName }) => _room == departmentName)
		this.setState({ devices })
	}
	// 渲染设备列表
	renderDevices = devices => {
		if (!devices.length) return null
		let { onDragStart } = this
		return devices.map((device, i) => <DragItem key={i} data={device} onDragStart={onDragStart} />)
	}
	// 渲染配置列表
	renderGrids = grids => {
		if (!grids.length) return null
		let { onDrop, onRemove } = this
		return grids.map((grid, i) => <DropItem key={i} idx={i} data={grid} onDrop={onDrop} onRemove={onRemove} />)
	}
	// 渲染科室搜索
	renderOptions = () => {
		let { options } = this.state
		return Object.values(options).map((room, i) => {
			return <Option key={i} value={room}>{room}</Option>
		})
	}
	// 拖拽
	onDragStart = (e, id) => {
		console.log('拖拽设备: ', id)
		e.dataTransfer.setData('id', id)
	}
	onDrop = (e, idx) => {
		let { grids, gridIndex, deviceIndex } = this.state
		let id = e.dataTransfer.getData('id'),
			device = deviceIndex[id]
		grids[idx] = gridIndex[id] = device
		this.setState({ grids, gridIndex }, this.deviceFilter)
	}
	// 删除配置
	onRemove = (e, idx) => {
		let { grids, gridIndex } = this.state
		let device = grids[idx]
		grids[idx] = undefined
		delete gridIndex[device.id]
		this.setState({ grids, gridIndex }, this.deviceFilter)
	}
	submit = () => {
		if (!__User__) return
		let { grids } = this.state
		let { dashboardId } = __User__
		let config = JSON.stringify(grids.map((grid, i) => {
			let obj = {}
			let bedName = __BedName__[i]
			if (!grid && !bedName) return obj
			let { id = 0 } = grid || {}
			__GridMap__[id] = i
			window.__GridIndex__[id] = grid
			obj[id] = bedName
			return obj
		}))
		serviceApi.dashboardsUpdate(dashboardId, { config }).then(da => {
			__Grid__ = grids
			this.websocket()
			this.props.history.push('/dashboard')
		})
	}
	websocket = () => {
		if (window._ws) return
		WS()
	}
	render() {
		let { devices, grids, gridIndex, search } = this.state,
			{ terminal, room } = search,
			allowSubmit = !Object.keys(gridIndex).length
		return (
			<>
				<div className="config">
					<div className="config-bar">
						<img className="cb-logo" src={logo} />
						<div className="cb-search">
							<Input
								value={terminal}
								className="cb-item"
								placeholder="请输入点位"
								onChange={e => this.updateSearch({ terminal: e.target.value })}
							/>
							<Select
								value={room}
								className="cb-item"
								onChange={room => this.updateSearch({ room })}
							>
								<Option value={''}>{'请选择'}</Option>
								{ this.renderOptions() }
							</Select>
						</div>
						<div className="cb-devices">
							{ this.renderDevices(devices) }
						</div>
					</div>
					<div className="config-group">
						<div className="cg-list">
							{ this.renderGrids(grids) }
						</div>
						<Button type="primary" disabled={allowSubmit} onClick={this.submit}>确定</Button>
					</div>
				</div>
				<Footer style={{ left: 226 }} />
			</>
		)
	}
}
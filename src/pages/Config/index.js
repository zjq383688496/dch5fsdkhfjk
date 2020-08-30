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
			options,
			search: {
				terminal: '',
				room:     0,
			}
		}
	}
	componentDidMount() {
		this.getDevices()
		this.getGrid()
	}
	max = randomRange(90, 130)
	// 参数变更
	updateSearch = (config = {}) => {
		let { search } = this.state
		Object.assign(search, config)
		this.setState({ search }, this.deviceFilter)
	}
	// 获取设备
	getDevices = () => {
		let deviceIndex = {}
		let options = {}
		let devices = new Array(this.max).fill().map((_, i) => {
			let id   = i + 1,
				rId  = randomRange(1, 10),
				room = `科室${rId}`
			let device = {
				id,
				name: `患者${id}`,
				status: randomRange(0, 1),
				no: '1234567890',
				rId,
				room,
				terminal: `点位${id}`,
			}
			deviceIndex[id] = device
			options[rId]    = { value: rId, name: room }
			return device
		})

		return { devices, deviceIndex, options }
	}
	// 获取配置
	getGrid = async () => {
		let { deviceIndex } = this.state
		let gridIndex = {}
		let grids = []
		let init = 0
		while (init < 16) {
			let has1 = randomRange(0, 1),
				has2 = randomRange(0, 1)

			if (!has1 || !has2) {
				grids.push(undefined)
				init++
				continue
			}

			let id = randomRange(1, this.max + 1)
			if (gridIndex[id]) continue
			let device = deviceIndex[id]
			gridIndex[id] = device
			grids.push(device)
			init++
		}
		this.setState({ grids, gridIndex }, this.deviceFilter)
	}
	// 过滤设备列表
	deviceFilter = () => {
		let { devicesFull, gridIndex, search } = this.state,
			{ terminal: _terminal, room } = search
		let devices = deepCopy(devicesFull)
		devices = devices.filter(({ id, status }) => !gridIndex[id] && !!status)
		if (_terminal) devices = devices.filter(({ terminal }) => new RegExp(_terminal).test(terminal))
		if (room)      devices = devices.filter(({ rId }) => rId == room)

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
		return Object.values(options).map(({ value, name }, i) => {
			return <Option key={i} value={value}>{name}</Option>
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
		this.websocket()
		this.props.history.push('/dashboard')
	}
	websocket = () => {
		if (window.__SOCKET__) return
		window.__SOCKET__ = WS()
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
								onChange={e => this.updateSearch({ terminal: e.target.value, room: 0 })}
							/>
							<Select
								value={room}
								className="cb-item"
								onChange={room => this.updateSearch({ room })}
							>
								<Option value={0}>{'请选择'}</Option>
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
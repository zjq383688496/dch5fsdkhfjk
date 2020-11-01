import React from 'react'
import { WEBSOCKET } from '@service'

import { HomeFilled } from '@ant-design/icons'

import ChartLine from './component/ChartLine'
import ChartWave from './component/ChartWave'
import Index     from './component/Index'
import TrendBox  from './component/TrendBox'

import './index.less'

import { USER_UPDATE } from '@service/storage'

const defData = {
	alarm:    [],
	config:   {},
	device:   {},
	measure:  {},
	realTime: {},
}

class Detail extends React.Component {
	constructor(props) {
		super(props)
		let { deviceId } = props.match.params
		this.state = {
			data: null,
			deviceId,
			trendStatus: false,
		}
	}
	componentDidMount() {
		this.task()
		USER_UPDATE()
		WEBSOCKET()
	}
	componentWillUnmount() {
		clearInterval(this.timeout)
	}
	timeout = null
	task = () => {
		let { deviceId } = this.state
		this.timeout = setInterval(() => {
			let init = Math.random(),
				data = this.getDevice(deviceId)
			this.setState({ init, data })
		}, __Interval__)
	}
	goBack = () => {
		this.props.history.push('/dashboard')
	}
	goTrend = () => {
		let { trendStatus } = this.state
		this.setState({ trendStatus: !trendStatus })
	}
	getDevice(deviceId) {
		return __Redux__.Devices[deviceId] || deviceByGrid(deviceId)
	}
	getBedName(deviceId) {
		let idx = __GridMap__[deviceId]
		let bedName = __BedName__[idx]
		return bedName
	}
	getClear(clear, timestamp) {
		let clearValue = false
		if (!timestamp) return clearValue
		clearValue = clear[timestamp] != undefined
		if (clearValue) delete clear[timestamp]
		return clearValue
	}
	render() {
		let { data, deviceId, trendStatus } = this.state
		if (!data) return null
		let { alarm: [ alarm1, alarm2, alarm3 ], clear, config, device, measure, realTime, textMessage, timestamp = '' } = data,
			{ positionName = '', name = '', deviceName = '', departmentName = '', patientName = '', code = '' } = device,
			MIN = __MIN__[deviceId]
		let bedName = this.getBedName(deviceId)
		let a1 = getAlarm(alarm1),
			a2 = getAlarm(alarm2),
			a3 = getAlarm(alarm3),
			clearValue = this.getClear(clear, timestamp)
		return (
			<div className="detail fx-col">
				<div className="detail-top h124">
					<div className="detail-l fx-col">
						<div className="d-info h124 bc-blue c-white">
							<div className="di-title fx-col col-24 p8 pl20">
								<div className="row-6 fs20 lh28">姓 名: {patientName}</div>
								<div className="row-6 fs20 lh28">点 位: {positionName}</div>
								<div className="row-6 fs20 lh28">科 室: {departmentName}</div>
								<div className="row-6 fs20 lh28">设 备: {code}</div>
								<span className="di-bedName fs20 p8 lh28">床号: {bedName}</span>
							</div>
						</div>
					</div>
					<div className="detail-c fx-col">
						<div className="d-info h124 fx bc-blue">
							<div className="di-title fx-col col-8 c-white p8">
								<div className="row-24 fs48 lh96">{textMessage}</div>
							</div>
							<div className="di-title col-16 fx-col fs36 lh40">
								<div className={`row-12 p12 ${a1.cls}`}>{a1.content}</div>
								<div className={`row-12 p12 ${a2.cls}`}>{a2.content}</div>
							</div>
						</div>
					</div>
					<div className="detail-r fx-col">
						<div className="d-info h124 fx bc-blue">
							<div className="di-title col-24 fx-col fs36 lh40">
								<div className={`row-12 p8 ${a3.cls}`}>{a3.content}</div>
								<div className="row-12 c-white p8">仅供测试非临床使用</div>
							</div>
						</div>
					</div>
				</div>
				<div className="detail-body">
					{
						trendStatus
						? <TrendBox device={device} bedName={bedName} onClose={this.goTrend} />
						: null
					}
					{
						!trendStatus
						?
						<>
							<div className="detail-l fx-col">
								<div className="d-content fx-col">
									<div className="row-12">
										{
											MIN && __VisibilityState__ === 'visible'
											?
											<ChartLine clear={clearValue} config={config} MIN={MIN} deviceId={deviceId} realTime={realTime} fieldX={'PAW'} fieldY={'VOLUME'} />
											: null
										}
									</div>
									<div className="row-12">
										{
											MIN && __VisibilityState__ === 'visible'
											?
											<ChartLine clear={clearValue} config={config} MIN={MIN} deviceId={deviceId} realTime={realTime} fieldX={'VOLUME'} fieldY={'FLOW'} />
											: null
										}
									</div>
								</div>
							</div>
							<div className="detail-c fx-col">
								<div className="d-content fx-col">
									<div className="row-8">
										{
											__VisibilityState__ === 'visible'
											?
											<ChartWave field={'PAW'}  config={config} realTime={realTime} />
											: null
										}
									</div>
									<div className="row-8">
										{
											__VisibilityState__ === 'visible'
											?
											<ChartWave field={'FLOW'} config={config} realTime={realTime} />
											: null
										}
									</div>
									<div className="row-8">
										{
											__VisibilityState__ === 'visible'
											?
											<ChartWave field={'VOLUME'}  config={config} realTime={realTime} />
											: null
										}
									</div>
								</div>
							</div>
						</>
						: null
					}
					<div className="detail-r fx-col">
						<div className="d-content fx-col">
							<Index data={measure} field1={'PPEAK'} field2={'PPLAT'} field3={'PEEP'} />
							<Index data={measure} field1={'MVE'}   field2={'VTE'}   field3={'ETCO2'} />
							<Index data={measure} field1={'RR'}    field2={'TI'}    field3={'IE'} />
							<Index data={measure} field1={'FIO2'}  field2={'R'}     field3={'C'} />
						</div>
					</div>
				</div>
				<div className="btn-box h124 fx-col">
					<div className="btn-back" onClick={this.goBack}>
						<i className="icons-home"></i>
					</div>
					<div className="btn-back" onClick={this.goTrend}>
						<i className={`icons-trend${trendStatus? ' s-selected': ''}`}></i>
					</div>
				</div>
			</div>
		)
	}
}

function deviceByGrid(id) {
	let grid = __GridIndex__[id],
		data = deepCopy(defData)
	data.device = deepCopy(grid)
	return data
}

export default Detail
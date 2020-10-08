import React from 'react'

import { HomeFilled } from '@ant-design/icons'

import ChartLine from './component/ChartLine'
import ChartWave from './component/ChartWave'
import Index     from './component/Index'
import TrendBox  from './component/TrendBox'

import './index.less'

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
			trendStatus: true,
		}
	}
	componentDidMount() {
		this.task()
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
	render() {
		let { data, deviceId, trendStatus } = this.state
		if (!data) return null
		let { alarm, config, device, measure, realTime } = data,
			{ positionName = '', name = '', deviceName = '', departmentName = '', patientName = '' } = device
		return (
			<div className="detail fx-col">
				<div className="detail-top h124">
					<div className="detail-l fx-col">
						<div className="d-info h124 bc-blue c-white">
							<div className="di-title fx-col col-24 p8 pl20">
								<div className="row-6 fs20 lh28">姓 名: {patientName}</div>
								<div className="row-6 fs20 lh28">点 位: {positionName}</div>
								<div className="row-6 fs20 lh28">科 室: {departmentName}</div>
								<div className="row-6 fs20 lh28">设 备: {deviceName}</div>
							</div>
						</div>
					</div>
					<div className="detail-c fx-col">
						<div className="d-info h124 fx bc-blue">
							<div className="di-title fx-col col-8 c-white p8">
								<div className="row-14 fs48">VC-AC</div>
								<div className="row-10 fs36 lh36">AutoFlow</div>
							</div>
							<div className="di-title col-16 fx-col fs36 lh40">
								<div className="row-12 bc-red c-white p12">{alarm[0]}</div>
								<div className="row-12 bc-yellow c-black p12">{alarm[1]}</div>
							</div>
						</div>
					</div>
					<div className="detail-r fx-col">
						<div className="d-info h124 fx bc-blue">
							<div className="di-title col-24 fx-col fs36 lh40">
								<div className="row-12 bc-cyan c-black p8">{alarm[2]}</div>
								<div className="row-12 c-white p8">仅供测试非临床使用</div>
							</div>
						</div>
					</div>
				</div>
				<div className="detail-body">
					{
						trendStatus
						?
						<TrendBox />
						: null
					}
					{
						!trendStatus
						?
						<>
							<div className="detail-l fx-col">
								<div className="d-content fx-col">
									<div className="row-12">
										{<ChartLine config={config} deviceId={deviceId} realTime={realTime} fieldX={'PAW'} fieldY={'VOLUME'} />}
									</div>
									<div className="row-12">
										<ChartLine config={config} deviceId={deviceId} realTime={realTime} fieldX={'VOLUME'} fieldY={'FLOW'} />
									</div>
								</div>
							</div>
							<div className="detail-c fx-col">
								<div className="d-content fx-col">
									<div className="row-8">
										<ChartWave field={'VOLUME'}  config={config} realTime={realTime} color={'tan'} />
									</div>
									<div className="row-8">
										<ChartWave field={'PAW'}  config={config} realTime={realTime} />
									</div>
									<div className="row-8">
										<ChartWave field={'FLOW'} config={config} realTime={realTime} />
									</div>
								</div>
							</div>
						</>
						: null
					}
					<div className="detail-r fx-col">
						<div className="d-content fx-col">
							<Index data={measure} field1={'PEAK'}  field2={'PPLAT'} field3={'MVSPONT'} />
							<Index data={measure} field1={'MVE'}   field2={'VTE'}   field3={'ETCO2'} />
							<Index data={measure} field1={'RR'}    field2={'TI'}    field3={'IE'} />
							<Index data={measure} field1={'FIO2'}  field2={'R'}     field3={'C'} />
						</div>
					</div>
				</div>
				<div className="btn-box h124 fx-col">
					<div className="btn-back" onClick={this.goBack}><HomeFilled /></div>
					<div className="btn-back" onClick={this.goTrend}><HomeFilled /></div>
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
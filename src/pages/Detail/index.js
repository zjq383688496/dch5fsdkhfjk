import React from 'react'

import { HomeFilled } from '@ant-design/icons'

import ChartLine from './component/ChartLine'
import ChartWave from './component/ChartWave'
import Index     from './component/Index'

import './index.less'

class Detail extends React.Component {
	constructor(props) {
		super(props)
		let { deviceId } = props.match.params
		this.state = {
			data: null,
			deviceId
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
	getDevice(deviceId) {
		return __Redux__.Devices[deviceId]
	}
	render() {
		let { data, deviceId } = this.state
		if (!data) return null
		let { alarm, config, device, measure, realTime } = data,
			{ positionName = '', name = '', patientName = '' } = device,
			keyIndex = __DeviceKey__[deviceId]
		return (
			<div className="detail">
				<div className="detail-l fx-col">
					<div className="d-info h124 bc-blue c-white">
						<div className="di-title fx-col col-24 p8 pl20">
							<div className="row-8 fs24">姓 名: {patientName}</div>
							<div className="row-8 fs24">床 号: {positionName}</div>
							<div className="row-8 fs24">住院号: {name}</div>
						</div>
					</div>
					<div className="d-content fx-col">
						<div className="row-12">
							<ChartLine config={config} deviceId={deviceId} realTime={realTime} fieldX={'PAW'} fieldY={'VOLUME'} />
						</div>
						<div className="row-12">
							<ChartLine config={config} deviceId={deviceId} realTime={realTime} fieldX={'VOLUME'} fieldY={'FLOW'} />
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
					<div className="d-content fx-col">
						<div className="row-8">
							<ChartWave field={'VOLUME'} config={config} realTime={realTime} color={'tan'} />
						</div>
						<div className="row-8">
							<ChartWave field={'PAW'} config={config} realTime={realTime} />
						</div>
						<div className="row-8">
							<ChartWave field={'FLOW'} config={config} realTime={realTime} />
						</div>
					</div>
				</div>
				<div className="detail-r fx-col">
					<div className="d-info h124 fx bc-blue">
						<div className="di-title col-24 fx-col fs36 lh40">
							<div className="row-12 bc-cyan c-black p8">{alarm[2]}</div>
							<div className="row-12 c-white p8">{alarm[3]}</div>
						</div>
					</div>
					<div className="d-content fx-col">
						<Index data={measure} field1={'PEAK'} field2={'PPLAT'} field3={'MVSPONT'} />
						<Index data={measure} field1={'MVE'}  field2={'VTE'}   field3={'ETCO2'} />
						<Index data={measure} field1={'RR'}   field2={'TI'}    field3={'IE'} />
						<Index data={measure} field1={'FIO2'} field2={'R'}     field3={'C'} />
					</div>
				</div>
				<div className="btn-back" onClick={this.goBack}><HomeFilled /></div>
			</div>
		)
	}
}

export default Detail
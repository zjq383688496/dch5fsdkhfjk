import React from 'react'

import { CloseOutlined } from '@ant-design/icons'

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
		}, 100)
	}
	goBack = () => {
		this.props.history.push('/dashboard')
	}
	getDevice(deviceId) {
		let [ data = null ] = __Redux__.Devices.filter(_ => _.deviceId == deviceId)
		return data
	}
	render() {
		let { data } = this.state
		if (!data) return null
		let { config, device, measure, realTime } = data,
			{ no } = device
		return (
			<div className="detail">
				<div className="detail-l fx-col">
					<div className="d-info h124 bc-blue c-white">
						<div className="di-title fx-col col-24 p8 pl20">
							<div className="row-8 fs24">姓 名:{no}</div>
							<div className="row-8 fs24">床 号:{no}</div>
							<div className="row-8 fs24">住院号:{no}</div>
						</div>
					</div>
					<div className="d-content fx-col">
						<div className="row-12">
							<ChartLine config={config} realTime={realTime} fieldX={'PAW'} fieldY={'VOLUME'} />
						</div>
						<div className="row-12">
							<ChartLine config={config} realTime={realTime} fieldX={'VOLUME'} fieldY={'FLOW'} />
						</div>
					</div>
				</div>
				<div className="detail-c fx-col">
					<div className="d-info h124 fx bc-blue">
						<div className="di-title fx-col col-8 c-white p8">
							<div className="row-14 fs48">VC-AC</div>
							<div className="row-10 fs36 lh36">AutoFlow</div>
						</div>
						<div className="di-title col-16 fx-col fs36 lh36">
							<div className="row-12 bc-red c-white p12">VT High</div>
							<div className="row-12 bc-yellow c-black p12">etCO2 High</div>
						</div>
					</div>
					<div className="d-content fx-col">
						<div className="row-8">
							<ChartWave field={'CO2'}  config={config} realTime={realTime} color={'tan'} />
						</div>
						<div className="row-8">
							<ChartWave field={'PAW'}  config={config} realTime={realTime} />
						</div>
						<div className="row-8">
							<ChartWave field={'FLOW'} config={config} realTime={realTime} />
						</div>
					</div>
				</div>
				<div className="detail-r fx-col">
					<div className="d-info h124 fx bc-blue">
						<div className="di-title col-24 fx-col fs36 lh36">
							<div className="row-12 bc-cyan c-black p8">Soundsystem error</div>
						</div>
					</div>
					<div className="d-content fx-col">
						<Index data={measure} field1={'PEAK'}  field2={'PPLAT'} field3={'MVSPONT'} />
						<Index data={measure} field1={'MVE'}   field2={'VTE'}   field3={'ETCO2'} />
						<Index data={measure} field1={'RR'}    field2={'TI'}    field3={'IE'} />
						<Index data={measure} field1={'FIO2'}  field2={'R'}     field3={'C'} />
					</div>
				</div>
				<div className="btn-back" onClick={this.goBack}><CloseOutlined /></div>
			</div>
		)
	}
}

export default Detail
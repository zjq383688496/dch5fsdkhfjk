import React from 'react'
import { withRouter } from 'react-router-dom'

import './index.less'

import Charts from '../Charts'
import Index  from '../Index'

class Box extends React.Component {
	constructor(props) {
		super(props)
	}
	toPage = ({ id }) => {
		this.props.history.push(`/detail/${id}`)
	}
	render() {
		let { data } = this.props
		let { config, device, measure, realTime } = data
		return (
			<div className="dashboard-box" onClick={e => this.toPage(device)}>
				<div className="db-info fx h40 bc-blue c-white">
					<div className="db-info-item col-6 p4 pl8">
						<p className="fs12 lh12">床号:</p>
						<p className="fs20 lh20">{device.no}</p>
					</div>
					<div className="db-info-item col-6 p4 pl8">
						<p className="fs20 lh20">VC-AC</p>
						<p className="fs12 lh12">AutoFlow</p>
					</div>
					<div className="db-info-item col-12 bc-red p8 pl20 fs24 lh24">
						<p className="fs-20 lh-20">VT High</p>
					</div>
				</div>
				<Charts field={'PAW'} config={config} realTime={realTime} />
				<div className="db-index fx h92 fs12">
					<Index title={'ETCO2'} color={'tan'} data={measure} />
					<Index title={'PEAK'}  data={measure} />
					<Index title={'VTE'}   color={'red'} data={measure} />
					<Index title={'MVE'}   data={measure} />
				</div>
			</div>
		)
	}
}
export default withRouter(Box)
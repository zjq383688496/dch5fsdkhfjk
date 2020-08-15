import React from 'react'
import { HeatMapOutlined } from '@ant-design/icons'
import './index.less'

const iconMap = {
	ETCO2: 1,
	VTE: 1
}

export default class Index extends React.Component {
	constructor(props) {
		super(props)
	}
	componentDidMount() {
	}
	render() {
		let { color = 'blue-d', title, data } = this.props
		let { u: unit, n: name } = __Map__.m[title] || {}
		let value = data[title]
		return (
			<div className="db-index-item fx-col p4">
				<div className="fx row-10">
					<div className={`col-12 c-${color} fs12`}>
						<b>{name}</b>
						{
							/*name
							? <p>{name}</p>
							: null*/
						}
					</div>
					{
						unit
						? <div className="col-12 tr">{unit}</div>
						: null
					}
				</div>
				<div className="row-14 fx">
					<div className="fx-col col-5 jc-fe fs12 lh16">
					</div>
					<div className={`col-15 c-${color} fs40 lh56 tr`}>{value}</div>
					<div className={`fx-col col-4 jc-fe c-${color} tr`}>
						{
							iconMap[title]
							?
							<HeatMapOutlined style={{ paddingBottom: '.2vw' }} />
							: null
						}
					</div>
				</div>
			</div>
		)
	}
}

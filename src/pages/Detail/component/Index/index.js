import React from 'react'
// import { HeatMapOutlined } from '@ant-design/icons'
import './index.less'

const colorMap = {
	// ETCO2: 'tan'
}
const iconMap = {
	ETCO2: 1,
}

export default class Index extends React.Component {
	constructor(props) {
		super(props)
	}
	dataFormat = () => {
		let { color, data, field1, field2, field3 } = this.props
		let data1  = data[field1],
			info1  = __Map__.m[field1] || {},
			data2  = data[field2],
			info2  = __Map__.m[field2] || {},
			data3  = data[field3],
			info3  = __Map__.m[field3] || {},
			color1 = colorMap[field1] || 'blue-d',
			color2 = colorMap[field2] || 'blue-d',
			color3 = colorMap[field3] || 'blue-d'
		return [ data1, data2, data3, field1, field2, field3, color1, color2, color3, info1, info2, info3 ]
	}
	render() {
		let [
				data1, data2, data3, field1, field2, field3, color1, color2, color3, info1, info2, info3
			] = this.dataFormat()
		return (
			<div className="detail-index row-6 fx">
				<div className={`di-border-r col-16 fx-col p12 pl20 c-${color1}`}>
					<div className="row-7 fx fs28 lh28">
						<div className="col-6">
							<b>{info1.n}</b>
							<p></p>
						</div>
						<div className="col-6 fx c-gray">{info1.u}</div>
					</div>
					<div className="row-17 fx">
						<div className="col-6 fx-col fs28 lh28 jc-fe c-gray">
							{
							/*
								<p>{data1.max}</p>
								<p>{data1.min}</p>
							*/
							}
						</div>
						<div className="col-18 fx-col fs120 lh160">{data1}</div>
					</div>
				</div>
				<div className="col-8 fx-col">
					<div className={`di-border-b row-12 fx-col p12 c-${color2}`}>
						<div className="row-6 fx fs24 lh28">
							<div className="col-24">
								{info2.n}
								<span className="ml12 c-gray">{info2.u}</span>
							</div>
						</div>
						<div className="row-18 tr fs60 lh70">
							<div className="col-18 tr">{data2}</div>
							<div className="col-6"></div>
						</div>
					</div>
					<div className={`row-12 fx-col p12 c-${color3}`}>
						<div className="row-6 fx fs24 lh28">
							<div className="col-12">
								{info3.n}
								<span className="ml12 c-gray">{info3.u}</span>
							</div>
						</div>
						<div className="row-18 fs60 lh70 fx">
							<div className="col-18 tr">{data3}</div>
							<div className="col-6 tr">
								{
									/*iconMap[field3]
									? <HeatMapOutlined style={{ fontSize: '2vw', paddingBottom: '.2vw' }} />
									: null*/
								}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

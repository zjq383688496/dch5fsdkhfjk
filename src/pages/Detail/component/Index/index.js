import React from 'react'
import './index.less'

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
			color1 = 'blue-d',
			color2 = 'blue-d',
			color3 = 'blue-d'
		if (field3 === 'IE') {
			data3 = getIE(data)
		}
		return [ data1, data2, data3, field1, field2, field3, color1, color2, color3, info1, info2, info3 ]
	}
	render() {
		let [
				data1, data2, data3, field1, field2, field3, color1, color2, color3, info1, info2, info3
			] = this.dataFormat()
		return (
			<div className="detail-index row-6 fx">
				<div className={`di-border-r col-16 fx-col p12 pl20 c-${color1}`}>
					<div className="row-7 fx jc-bw fs28 lh28">
						<b className="quota-c">{info1.n}</b>
						<span className="quota-uc">{info1.u}</span>
					</div>
					<div className="row-17 fx">
						<div className="col-6 fx-col fs28 lh28 jc-fe c-gray"></div>
						<div className="col-18 fx-col fs120 lh160">{data1}</div>
					</div>
				</div>
				<div className="col-8 fx-col">
					<div className={`di-border-b row-12 fx-col p12 c-${color2}`}>
						<div className="row-6 fx fs24 lh28">
							<div className="col-24 fx jc-bw">
								<span className="quota-c">{info2.n}</span>
								<span className="quota-uc">{info2.u}</span>
							</div>
						</div>
						<div className="row-18 tr fs60 lh70">
							<div className="col-18 tr">{data2}</div>
							<div className="col-6"></div>
						</div>
					</div>
					<div className={`row-12 fx-col p12 c-${color3}`}>
						<div className="row-6 fx fs24 lh28">
							<div className="col-24 fx jc-bw">
								<span className="quota-c">{info3.n}</span>
								<span className="quota-uc">{info3.u}</span>
							</div>
						</div>
						<div className="row-18 fs60 lh70 fx">
							<div className="col-18 tr">{data3}</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

import React from 'react'
import './index.less'

export default class Index extends React.Component {
	constructor(props) {
		super(props)
	}
	componentDidMount() {
	}
	render() {
		let { active, color = 'blue-d', title, data, handleClick } = this.props
		let { u: unit, n: name } = __Map__.m[title] || {}
		let value = data[title]
		let cls   = `quota-c fs${title === 'VT/kg BW'? '11': '12'}`
		if (title === 'IE') {
			value = getIE(data)
		}
		return (
			<div className={`db-index-item fx-col p4 ${active? 's-active': ''}`} onClick={handleClick}>
				<div className="fx row-7" style={{ justifyContent: 'space-between' }}>
					<b className={cls}>{name}</b>
					<span className="quota-uc tr">{unit}</span>
				</div>
				<div className="row-17 fx">
					<div className={`col-24 c-${color} fs32 lh44 tc`}>{value}</div>
				</div>
			</div>
		)
	}
}

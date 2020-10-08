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
		let { u: unit, n: name } = __Map__.m[title] || __Map__.not[title] || {}
		let value = data[title]
		return (
			<div className={`db-index-item fx-col p4 ${active? 's-active': ''}`} onClick={handleClick}>
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
				</div>
			</div>
		)
	}
}

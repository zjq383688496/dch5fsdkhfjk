import React from 'react'
import './index.less'

const limit = 2 + 288		// 参数|单位 + 12小时数据
let list = {
	ETCO2: [
		[ '2020-09-22 08:30', '1' ],
		[ '2020-09-22 08:30', '1' ],
		[ '2020-09-22 08:30', '1' ],
		[ '2020-09-22 08:30', '1' ],
		[ '2020-09-22 08:30', '1' ],
		[ '2020-09-22 08:30', '1' ],
		[ '2020-09-22 08:30', '1' ],
		[ '2020-09-22 08:30', '1' ],
		[ '2020-09-22 08:30', '1' ],
		[ '2020-09-22 08:30', '1' ],
		[ '2020-09-22 08:30', '1' ],
		[ '2020-09-22 08:30', '1' ],
		[ '2020-09-23 08:30', '1' ],
		[ '2020-09-23 08:30', '1' ],
		[ '2020-09-23 08:30', '1' ],
		[ '2020-09-23 08:30', '1' ],
		[ '2020-09-23 08:30', '1' ],
		[ '2020-09-23 08:30', '1' ],
	]
}

export default class DataBox extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			times: []
		}
	}
	componentDidMount() {
		// let { u: unit, n: name } = __Map__.r[field] || {}
		this.getTimes()
	}
	renderTh = (data = []) => {
		return new Array(limit).fill().map((_, i) => {
			return <th key={i}>{data[i]}</th>
		})
	}
	renderTd = (data = []) => {
		return new Array(limit).fill().map((_, i) => {
			return <td key={i}>{data[i]}</td>
		})
	}
	getTimes = () => {
		let values = Object.values(list)[0]
		// let 
		let rp = /([\d]{2}-[\d]{2}-[\d]{2}) ([\d]{2}:[\d]{2})/
		let times  = values.map(([time]) => {
			let mt = time.match(rp)
			if (!mt) return ''
			// debugger
		})
		// debugger
	}
	render() {
		let { times } = this.state
		if (!times.length) return null
		return (
			<div className="data-box">
				<table>
					<tr>
						<th></th>
					</tr>
					<tr></tr>
				</table>
			</div>
		)
	}
}

import React from 'react'
import './index.less'

import { Table } from 'antd'
import moment from 'moment'

const limit = 2 + 288		// 参数|单位 + 12小时数据


export default class DataBox extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			list:  [],
			times: [],
		}
	}
	componentDidMount() {
		this.getData()
	}
	getData = async () => {
		await _wait(100)
		let item = {
			name: 'ETCO2',
			data: new Array(100).fill().map((_, i) => {
				return {
					value: 1,
					timestamp: 1607337000000 + i * 3e5
				}
			})
		}
		let list = new Array(12).fill().map(_ => item)
		this.setState({ list }, this.getTimes)
	}
	getTimes = () => {
		let { list } = this.state
		let values = deepCopy(list[0])
		let times  = values.data.map(({ timestamp }) => {
			let mon = moment(timestamp)
			let date = mon.format('YYYY-MM-DD')
			let time = mon.format('HH:mm')
			return { date, time }
		})
		this.setState({ times })
	}
	renderCol = () => {
		let { times } = this.state
		let cols = [
			<col key={0} style={{ width: 60, minWidth: 60 }} />,
			<col key={1} style={{ width: 60, minWidth: 60 }} />,
			...times.map((_, i) => {
				return <col key={i + 2} style={{ width: 40, minWidth: 40 }} />
			})
		]
		return (
			<colgroup>
				{ cols }
			</colgroup>
		)
	}
	renderTh = () => {
		let { times } = this.state
		let ths = [
			<th key={0} style={{ position: 'sticky', left: 0 }}>参数</th>,
			<th key={1} style={{ position: 'sticky', left: 60 }}>单位</th>,
			...times.map(({ time }, i) => {
				return <th key={i + 2}>{time}</th>
			})
		]
		return (
			<thead>
				<tr>{ ths }</tr>
			</thead>
		)
	}
	renderTd = () => {
		let { list } = this.state
		let trs = list.map((td, i) => {
			let { data } = td
			let { u: unit, n: name } = __Map__.m[td.name] || {}
			let tds = [
				<td key={0} style={{ position: 'sticky', left: 0 }}>{name}</td>,
				<td key={1} style={{ position: 'sticky', left: 60 }}>{unit}</td>,
				...data.map(({ value }, j) => {
					return <td key={j + 2}>{value}</td>
				})
			]
			return <tr key={i}>{tds}</tr>
		})
		return (
			<tbody>
				{ trs }
			</tbody>
		) 
	}
	render() {
		let { times } = this.state
		if (!times.length) return null
		let colgroup = this.renderCol()
		let thead    = this.renderTh()
		let tbody    = this.renderTd()
		return (
			<div className="data-box">
				<div className="db-header">
					<table>
						{ colgroup }
						{ thead }
					</table>
				</div>
				<div className="db-body">
					<table>
						{ colgroup }
						{ tbody }
					</table>
				</div>
			</div>
		)
	}
}

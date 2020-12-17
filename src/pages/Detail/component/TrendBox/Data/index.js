import React from 'react'
import './index.less'

import { Space, Spin } from 'antd'
import moment from 'moment'

import serviceApi from '@service/api'

import Scrollbar from '@comp/Scrollbar'
import Select    from '@comp/Select'

const options = [
	{ label: '5分钟',  value: 'MIN5' },
	{ label: '10分钟', value: 'MIN10' },
	{ label: '30分钟', value: 'MIN30' },
	{ label: '1小时',  value: 'H1' },
	{ label: '2小时',  value: 'H2' },
	{ label: '6小时',  value: 'H6' },
	{ label: '12小时', value: 'H12' },
	{ label: '1天',    value: 'D1' },
]

const timeUnitMap = {
	MIN5:  'time',
	MIN10: 'time',
	MIN30: 'time',
	H1:    'time',
	H2:    'time',
	H6:    'time',
	H12:   'time',
	D1:    'date',
}

export default class DataBox extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			list:     [],
			times:    [],
			height:   0,
			curDate:  '',
			timeUnit: 'D1',
		}
	}
	componentDidMount() {
		let { body } = this.refs
		this.getData()
		body.addEventListener('scroll', this.scrollUpdate.bind(this), false)
	}
	componentWillUnmount() {
		let { body } = this.refs
		body.removeEventListener('scroll', this.scrollUpdate)
	}
	scrollUpdate = () => {
		let { curDate, times } = this.state
		let { body, header } = this.refs
		let sl   = body.scrollLeft
		let idx  = parseInt(sl / 40)
		let da   = times[idx]
		header.scrollLeft = sl
		if (!da) return
		let { ydate } = da
		if (ydate === curDate) return
		this.setState({ curDate: ydate })
	}
	getData = async () => {
		let { m } = __Map__
		let { device } = this.props,
			{ macAddress } = device

		let { timeUnit } = this.state

		this.setState({ list: [], times: [], height: 0 })
		let dataMap = {}
		serviceApi.getTrendData(macAddress, timeUnit).then(res => {
			let list = res || [],
				len  = list.length
			list.forEach(measured => {
				let { dataCodeEnum, data } = measured
				let key = dataCodeEnum.replace(/^MEASURED_DATA_P[\d]_/, '')
				if (!m[key]) {
					m[key] = {}
					console.log(key, '不存在')
				}
				dataMap[key] = measured.data
				let { n: name, u: unit }  = m[key]
				measured.key = key
			})
			ieFormat(dataMap)
			this.setState && this.setState({ list, height: 24 * len }, this.getTimes)
		})
	}
	getTimes = () => {
		let { list } = this.state
		let values = deepCopy(list[0])
		let times  = values.data.map(({ timestamp }) => {
			let mon   = moment(timestamp)
			let ydate = mon.format('YYYY-MM-DD')
			let date  = mon.format('MM-DD')
			let time  = mon.format('HH:mm')
			return { ydate, date, time }
		})
		this.setState({ times }, this.scrollUpdate)
	}
	getHref = () => {
		let { device } = this.props,
			{ timeUnit }   = this.state,
			{ macAddress } = device
		let href = serviceApi.exportMeasuredData(macAddress, timeUnit)
		return href
	}
	changeParams = params => {
		this.setState(params, this.getData)
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
		let { times, timeUnit } = this.state
		let ths = [
			<th key={0} className="db-td-fixed" style={{ position: 'sticky', left: 0 }}>参数</th>,
			<th key={1} className="db-td-fixed" style={{ position: 'sticky', left: 60 }}>单位</th>,
			...times.map((t, i) => {
				let key = timeUnitMap[timeUnit]
				return <th key={i + 2}>{t[key]}</th>
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
			let { u: unit, n: name } = __Map__.m[td.key] || {}
			let tds = [
				<td key={0} className="db-td-fixed" style={{ position: 'sticky', left: 0 }}>{name || '-'}</td>,
				<td key={1} className="db-td-fixed" style={{ position: 'sticky', left: 60 }}>{unit || '-'}</td>,
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
		let { list, curDate, times, height, timeUnit } = this.state
		let { body } = this.refs
		let colgroup = this.renderCol()
		let thead    = this.renderTh()
		let tbody    = this.renderTd()
		let href     = this.getHref()
		let style = times.length? {}: { display: 'none' }
		return (
			<div className="data-box" style={style}>
				<div className="data-box-header">
					<div className="dbh-l">
						{ curDate }
					</div>
					<div className="dbh-r">
						<Space size={20}>
							视图
							<Select
								value={timeUnit}
								dataSource={options}
								onChange={timeUnit => this.changeParams({ timeUnit })}
							/>
							<a className="btn-export" target="_blank" href={href}>导出</a>
						</Space>
					</div>
				</div>
				<div className="data-box-body">
					<div className="data-box-table" style={{ height: height + 24 }}>
						<div ref="header" className="db-header">
							<table>
								{ colgroup }
								{ thead }
							</table>
						</div>
						<div ref="body" className="db-body" style={{ height }}>
							<table>
								{ colgroup }
								{ tbody }
							</table>
						</div>
						<div className="db-line-t"></div>
						<div className="db-line-r"></div>
						<div className="db-line-b"></div>
						<div className="db-line-l"></div>
					</div>
					<div className="data-box-scroll-v">
						{
							body && times.length
							?
							<Scrollbar
								dom={body}
								step={48}
								type={'v'}
								scrollEnd={this.scrollEnd}
							/>
							: null
						}
					</div>
				</div>
				<div className="data-box-scroll-b">
					{
						body && times.length
						?
						<Scrollbar
							dom={body}
							step={80}
							type={'h'}
							scrollEnd={this.scrollEnd}
						/>
						: null
					}
				</div>
			</div>
		)
	}
}

// IE格式化
function ieFormat({ IE }) {
	if (!IE) return
	let len = IE.length
	if (!len) return
	IE.forEach((_, i) => {
		if (!_ || !_.value) return
		let __ = _.value.toFixed(_ == 1? 0: 1)
		let val = `${__}:1`
		if (__ < 1) return `1:${__}`
		_.value = val
	})
}
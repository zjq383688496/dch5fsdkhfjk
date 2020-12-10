import React from 'react'
import './index.less'

import moment from 'moment'

import WaveStacked from '../WaveStacked'
import Modal       from '../Modal'

const parentData = [
	{ label: '压力',     value: 1 },
	{ label: '气体',     value: 2 },
	{ label: '分钟容量',  value: 3 },
	{ label: '时间/周期', value: 4 },
	{ label: '容量流量',  value: 5 },
	{ label: '其他',     value: 6 },
]
const childMap = {
	1: [
		{ label: 'PEAK',  value: 'PEAK' },
		{ label: 'PPLAT', value: 'PPLAT' },
		{ label: 'PMEAN', value: 'PMEAN' },
		{ label: 'PEEP',  value: 'PEEP' },
		{ label: '△P',    value: '△P' },
	],
	2: [
		{ label: 'FIO2',  value: 'FIO2' },
		{ label: 'ETCO2', value: 'ETCO2' },
	],
	3: [
		{ label: 'MVE', value: 'MVE' },
		{ label: 'MVI', value: 'MVI' },
	],
	4: [
		{ label: 'TI',     value: 'TI' },
		{ label: 'IE',     value: 'IE' },
		{ label: 'TCE',    value: 'TCE' },
		{ label: 'TPLAT',  value: 'TPLAT' },
		{ label: 'RR',     value: 'RR' },
		{ label: 'RRSPON', value: 'RRSPON' },
	],
	5: [
		{ label: 'VTE',      value: 'VTE' },
		{ label: 'VTI',      value: 'VTI' },
		{ label: 'VT/kg BW', value: 'VT/kg BW' },
		{ label: 'PIF',      value: 'PIF' },
		{ label: 'PEF',      value: 'PEF' },
	],
	6: [
		{ label: 'C',   value: 'C' },
		{ label: 'R',   value: 'R' },
		{ label: 'RSB', value: 'RSB' },
	],
}
const parentMap = {
	'PEAK':     1,
	'PPLAT':    1,
	'PMEAN':    1,
	'PEEP':     1,
	'△P':       1,
	'FIO2':     2,
	'ETCO2':    2,
	'MVE':      3,
	'MVI':      3,
	'TI':       4,
	'IE':       4,
	'TCE':      4,
	'TPLAT':    4,
	'RR':       4,
	'RRSPON':   4,
	'VTE':      5,
	'VTI':      5,
	'VT/kg BW': 5,
	'PIF':      5,
	'PEF':      5,
	'C':        6,
	'R':        6,
	'RSB':      6,
}

export default class WaveBox extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			colors:    props.colors || ['#3559d4', '#020c7e', '#22c8ee'],
			times:     props.times || [],
			curP:      null,
			checkP:    [],
			statusP:   false,
			checkC:    [],
			childData: [],
			statusC:   false,
			temporary: [],		// 子选项临时队列
			list:      [],

			waveRefresh: false,		// 波形可见
			// gridH:     0,			// 波形网格高
		}
	}
	componentDidMount() {
		// this.init()
	}
	// init = () => {
	// 	let { wave } = this.refs
	// 	if (!wave) return
	// 	this.setState({ gridH: Math.ceil(wave.clientHeight / 5) })
	// }
	getGridStyle = () => {
		let { gridH } = this.state
		if (!gridH) return {}
		let minH = gridH - 1
		return {
			background:     `-webkit-linear-gradient(top, transparent ${minH}px, #999 ${gridH}px),-webkit-linear-gradient(left, transparent ${minH}px, #999 ${gridH}px)`,
			backgroundSize: `${gridH}px ${gridH}px`
		}
	}
	onEdit = () => {
		let { statusP } = this.state
		this.setState({ statusP: !this.state.statusP })
	}
	onChangeP = curP => {
		this.setState({ curP, childData: childMap[curP.value], statusC: true })
	}
	onChangeC = ({ value }) => {
		let { temporary } = this.state
		let isIn = temporary.indexOf(value) > -1
		if (isIn) {
			return this.setState({ temporary: temporary.filter(_ => _ != value) })
		} else if (temporary.length < 3) {
			temporary.push(value)
			return this.setState({ temporary })
		}
	}
	onClearP = () => {
		this.setState({ curP: null, checkP: [], childData: [], temporary: [], statusP: false })
		this.waveRefresh()
	}
	onCancelP = () => {
		this.setState({ curP: null, statusP: false })
	}
	onOkC = () => {
		let { data } = this.props
		let { checkC, temporary } = this.state
		checkC = deepCopy(temporary)
		let list = checkC.map(_ => data[_])
		this.setState({ list, checkC, checkP: this.updateCheckP(checkC), statusC: false, curP: null, childData: [] })
		this.waveRefresh()
	}
	waveRefresh = () => {
		this.setState({ waveRefresh: true }, () => {
			this.setState && this.setState({ waveRefresh: false })
		})
	}
	onCancelC = () => {
		let { checkC, temporary } = this.state
		temporary = deepCopy(checkC)
		this.setState({ temporary, checkP: this.updateCheckP(checkC), statusC: false, curP: null, childData: [] })
	}
	updateCheckP = checkC => {
		let check = {}, checkP
		checkC.forEach(_ => {
			let parentId = parentMap[_]
			check[parentId] = true
		})
		return Object.keys(check)
	}
	// 渲染辅助
	renderHelper = () => {
		let { checkC, colors, list } = this.state
		if (!checkC.length) return null

		return checkC.map((_, i) => {
			let { u: unit, n: name } = __Map__.m[_] || {}
			let color = colors[i]
			let style = { color }
			let data  = list[i] || {}
			let { min, max } = data
			return (
				<div key={i} className="wbh-block">
					<div className="wbh-title" style={style}>
						<b>{name}</b>
						<span>{unit}</span>
					</div>
					<div className="wbh-ruler">
						<div className="wbh-marking">
							<b></b>
							<b></b>
							<b></b>
							<b></b>
							<b></b>
							<b></b>
						</div>
						<div className={`wbh-line wbh-line-${i? 'dashed': 'solid'}`}>
						</div>
						<div className="wbh-limit">
							<b>{min}</b>
							<b>{max}</b>
						</div>
					</div>
				</div>
			)
		})
	}
	// 渲染参数
	renderParams = () => {
		let { checkC, colors } = this.state
		if (!checkC.length) return null

		let params = checkC.map((_, i) => {
			let color = colors[i]
			let style = { color }
			return (
				<li key={i} style={style}>
					<div>{_}</div>
					<span>--</span>
				</li>
			)
		})
		return (
			<ul className="wb-param">
				{ params }
			</ul>
		)
	}
	// 渲染游标
	renderCursor = () => {
		let { cursor } = this.props
		if (!cursor) return null
		let da   = moment(cursor)
		let time = da.format('HH:mm')
		let date = da.format('DD-MM-YYYY')
		return (
			<div className="wb-cursor">
				<div className="wbc-l">游标</div>
				<div className="wbc-r">
					<p>{time}</p>
					<p>{date}</p>
				</div>
			</div>
		)
	}
	render() {
		let { onLoaded } = this.props
		let { colors, list, waveRefresh, curP, checkP, statusP, checkC, statusC, childData, temporary, times } = this.state
		let params = this.renderParams()
		let cursor = this.renderCursor()
		let helper = this.renderHelper()
		// let style  = this.getGridStyle()
		return (
			<div className="wave-box">
				<div className="wb-content">
					<div className="wb-helper">
						{ helper }
					</div>
					<div className="wb-wave">
						<div ref="wave" className="wb-wave-box" style={{}}>
							{
								!waveRefresh && list.length
								? <WaveStacked parent={this.refs.wave} colors={colors} list={list} times={times} onLoaded={onLoaded} />
								: null
							}
						</div>
					</div>
				</div>
				<div className="wb-ctrl">
					<div className="wb-norm">
						{ cursor }
						{ params }
					</div>
					<a className={`icons-search${statusP? ' s-active': ''}`} onClick={this.onEdit}></a>
					<Modal
						visible={statusP}
						title={'设置'}
						value={checkP}
						dataSource={parentData}
						onChange={this.onChangeP}
						style={{ top: 24, right: 40 }}
						okText={'全部清除'}
						cancelText={'取消'}
						onOk={this.onClearP}
						onCancel={this.onCancelP}
						onClose={this.onCancelP}
					/>
					<Modal
						visible={statusC}
						title={curP? curP.label: ''}
						value={temporary}
						dataSource={childData}
						onChange={this.onChangeC}
						style={{ top: 24, right: 40 }}
						okText={'取消'}
						cancelText={'确定'}
						onOk={this.onCancelC}
						onCancel={this.onOkC}
						onClose={this.onCancelC}
					/>
				</div>
			</div>
		)
	}
}

import React from 'react'
import './index.less'

import moment from 'moment'

import WaveStacked from '../WaveStacked'
import Modal       from '../Modal'

const { floor, max } = Math

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

			// 拖拽
			lineShow: false,
			dragState: false,
		}
	}
	componentDidMount() {
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
	onCancelC = () => {
		let { checkC, temporary } = this.state
		temporary = deepCopy(checkC)
		this.setState({ temporary, checkP: this.updateCheckP(checkC), statusC: false, curP: null, childData: [] })
	}
	waveRefresh = () => {
		this.setState({ waveRefresh: true }, () => {
			this.setState && this.setState({ waveRefresh: false })
		})
	}
	updateCheckP = checkC => {
		let check = {}, checkP
		checkC.forEach(_ => {
			let parentId = parentMap[_]
			check[parentId] = true
		})
		return Object.keys(check)
	}
	// 拖拽开启
	onMouseDown = e => {
		let { dom } = this.props
		if (!dom) return console.log('dom: 不存在')
		this.setState({ dragState: true, lineShow: true })
	}
	// 拖拽中
	onMouseMove = e => {
		let { dragState } = this.state
		if (!dragState) return
		let { dom, width, times, scrollCfg: { scrollLeft }, onDrag } = this.props
		let length = times.length
		let maxWidth = max(length, width)
		let { pageX } = e
		let current = []
		let startP = pageX - 20
		startP = startP < 0? 0: startP
		startP = startP > width? width: startP
		let startX = scrollLeft + startP
		let ratio  = startX / maxWidth
		let left   = ratio * maxWidth
		left = left >= maxWidth? maxWidth - 1: left
		let idx    = floor(ratio * (length - 1))
		// console.log(idx, `${(startX / maxWidth * 100).toFixed(1)}%`)
		onDrag && onDrag({ idx, ratio, left })
	}
	// 拖拽关闭
	onMouseUp = e => {
		this.setState({ dragState: false })
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
		let { cursor } = this.props
		let params = checkC.map((_, i) => {
			let color = colors[i]
			let style = { color }
			let value = cursor && cursor[_] && cursor[_].value? cursor[_].value: '--'
			return (
				<li key={i} style={style}>
					<div>{_}</div>
					<span>{value}</span>
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
		let time = '--',
			date = '--'
		if (cursor.timestamp) {
			let da = moment(cursor.timestamp)
			time = da.format('HH:mm')
			date = da.format('DD-MM-YYYY')
		}
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
		let { dragCfg, scrollCfg, onLoaded } = this.props
		let {
			colors, list, waveRefresh,
			curP, checkP, statusP, checkC, statusC,
			childData, temporary, times,
			dragState,
		} = this.state
		let params = this.renderParams()
		let cursor = this.renderCursor()
		let helper = this.renderHelper()
		return (
			<>
				<div className="wave-box">
					<div className="wb-content">
						<div className="wb-helper">
							{ helper }
						</div>
						<div className="wb-wave" onMouseDown={this.onMouseDown}>
							<div ref="wave" className="wb-wave-box" style={{}}>
								{
									!waveRefresh && list.length
									? <WaveStacked parent={this.refs.wave} dragCfg={dragCfg} scrollCfg={scrollCfg} colors={colors} list={list} times={times} onLoaded={onLoaded} />
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
				{
					dragState
					? 
					<div
						className="wave-box-mask"
						onMouseMove={this.onMouseMove}
						onMouseUp={this.onMouseUp}
						onMouseOut={this.onMouseUp}
					></div>
					: null
				}
			</>
		)
	}
}

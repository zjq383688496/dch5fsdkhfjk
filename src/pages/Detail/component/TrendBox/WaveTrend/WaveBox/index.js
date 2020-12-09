import React from 'react'
import './index.less'

import WaveStacked from '../WaveStacked'
import Modal       from '../Modal'

const colorMap = {
	'tan':    '#a89f20',
	'blue-d': '#020c7e',
}

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

		let { color = 'blue-d' } = props

		this.state = {
			color,
			curP:      null,
			checkP:    [],
			statusP:   false,
			checkC:    [],
			childData: [],
			statusC:   false,
			temporary: [],		// 子选项临时队列
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
	}
	onCancelP = () => {
		this.setState({ curP: null, statusP: false })
	}
	onOkC = () => {
		let { checkC, temporary } = this.state
		checkC = deepCopy(temporary)
		this.setState({ checkC, checkP: this.updateCheckP(checkC), statusC: false, curP: null, childData: [] })
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
	render() {
		let { color, curP, checkP, statusP, checkC, statusC, childData, temporary } = this.state
		return (
			<div className="wave-box">
				<div className="wb-content">
					<div className="wb-helper">
					</div>
					<div className="wb-wave">
						{/*<WaveStacked />*/}
					</div>
				</div>
				<div className="wb-ctrl">
					<div className="wb-norm">
						<div className="wb-cursor">
						</div>
						<ul className="wb-param">
							<li>
								<div></div>
								<span></span>
							</li>
							<li>
								<div></div>
								<span></span>
							</li>
							<li>
								<div></div>
								<span></span>
							</li>
						</ul>
					</div>
					<a className="icons-search" onClick={this.onEdit}></a>
					<Modal
						visible={statusP}
						title={'设置'}
						value={checkP}
						dataSource={parentData}
						onChange={this.onChangeP}
						style={{ top: 24, right: 80 }}
						okText={'全部清除'}
						cancelText={'取消'}
						onOk={this.onClearP}
						onCancel={this.onCancelP}
					/>
					<Modal
						visible={statusC}
						title={curP? curP.label: ''}
						value={temporary}
						dataSource={childData}
						onChange={this.onChangeC}
						style={{ top: 24, right: 80 }}
						okText={'取消'}
						cancelText={'确定'}
						onOk={this.onCancelC}
						onCancel={this.onOkC}
					/>
				</div>
			</div>
		)
	}
}

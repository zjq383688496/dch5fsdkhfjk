import React from 'react'
import './index.less'

import moment from 'moment'

import serviceApi from '@service/api'

import WaveStacked from '../WaveStacked'
import Modal       from '../Modal'

import { parentData, childMap, parentMap } from './config'

const { floor, max } = Math

export default class WaveBox extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			colors:    props.colors || ['#3559d4', '#020c7e', '#22c8ee'],
			data:      deepCopy(props.data || {}),
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
	componentWillReceiveProps(props) {
		let { data } = props
		let { checkC } = this.state
		if (objEqual(data, this.state.data)) return
		let list = checkC.map(_ => data[_])
		this.setState({ list, data: deepCopy(data) })
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
		this.setState({ curP: null, checkP: [], checkC: [], childData: [], temporary: [], statusP: false })
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
		this.setState({ checkC, checkP: this.updateCheckP(checkC), statusC: false, curP: null, childData: [] })
		this.waveRefresh()
	}
	onCancelC = () => {
		let { checkC, temporary } = this.state
		temporary = deepCopy(checkC)
		this.setState({ temporary, checkP: this.updateCheckP(checkC), statusC: false, curP: null, childData: [] })
	}
	waveRefresh = () => {
		let { getData } = this.props
		this.setState({ waveRefresh: true }, () => {
			getData()
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
							<b>{max || 100}</b>
							<b>{min || 0}</b>
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
			let { n } = __Map__.m[_] || {}
			let value = cursor && cursor[_] && cursor[_].value? cursor[_].value: '--'
			return (
				<li key={i} style={style}>
					<div>{n}</div>
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

		let hasData = list.filter(_ => !!_).length === list.length
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
									!waveRefresh && list.length && hasData
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
						<a className={`icons-trend-edit${statusP? ' s-active': ''}`} onClick={this.onEdit}></a>
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

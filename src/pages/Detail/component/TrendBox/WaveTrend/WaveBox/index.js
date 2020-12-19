import React from 'react'
import './index.less'

import moment from 'moment'

import serviceApi from '@service/api'

import WaveStacked from '../WaveStacked'
import Modal       from '../Modal'

import { parentData, childMap, parentMap } from './config'

const { floor, max, min } = Math

export default class WaveBox extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			colors:    props.colors || ['#3559d4', '#020c7e', '#22c8ee'],
			data:      deepCopy(props.data || {}),
			curP:      null,
			checkP:    [],
			statusP:   false,
			checkC:    [],
			childData: [],
			statusC:   false,
			temporary: [],		// 子选项临时队列
			list:      [],
			gridH:     0,		// 网格高度
			height:    0,		// 区域高度

			waveRefresh: false,		// 波形可见

			// 拖拽
			lineShow: false,
			dragState: false,
		}

		this.gridH = 0
	}
	componentWillReceiveProps(props) {
		let { data, resize } = props
		let { checkC } = this.state
		if (resize) this.calcHeight()
		if (objEqual(data, this.state.data)) return
		let list = checkC.map(_ => data[_])
		this.setState({ list, data: deepCopy(data) })
	}
	componentDidMount() {
		this.calcHeight()
	}
	componentWillUnmount() {}
	calcHeight = () => {
		let { wave } = this.refs
		let width  = parseFloat(getComputedStyle(wave).width)
		let gridH  = width / 15
		let height = width / 3
		this.setState({ height, gridH })
		this.gridH = gridH
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
	getGridStyle = () => {
		let { gridH } = this.state
		if (!gridH) return {}
		let minH = gridH - 1
		return {
			background:     `-webkit-linear-gradient(top, transparent ${minH}px, #999 ${gridH}px),-webkit-linear-gradient(left, transparent ${minH}px, #999 ${gridH}px) 0 0`,
			// backgroundPosition: `1px 0`,
			backgroundSize: `${gridH}px ${gridH}px`,
		}
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
		let { width, times, scrollCfg: { scrollLeft }, onDrag } = this.props
		let length    = times.length
		let minWidth  = min(scrollLeft + width, length)
		let { pageX } = e
		let startP = pageX - 20
		startP = startP < 0? 0: startP
		startP = startP > width? width: startP
		let left = scrollLeft + startP

		left = left < scrollLeft? scrollLeft: left
		left = left >= minWidth? minWidth - 1: left
		onDrag && onDrag({ idx: left })
	}
	// 拖拽关闭
	onMouseUp = e => {
		this.setState({ dragState: false })
	}
	// 鼠标滚动
	onWheel = e => {
		let { nativeEvent } = e
		// nativeEvent.preventDefault()
		// e.preventDefault()
		let { deltaY } = nativeEvent
		if (!deltaY) return
		let { width, times, scrollCfg: { scrollLeft }, dragCfg: { idx: left }, onDrag } = this.props

		let add = deltaY > 0? 1: -1
		left += add

		let length   = times.length
		let minWidth = min(scrollLeft + width, length)
		left = left < scrollLeft? scrollLeft: left
		left = left >= minWidth? minWidth - 1: left

		onDrag && onDrag({ idx: left })
	}
	// 渲染辅助
	renderHelper = () => {
		let { checkC, colors, list } = this.state
		if (!checkC.length) return null

		return [0, 1, 2].map(i => {
			let _ = checkC[i]
			if (!_) return <div key={i} className="wbh-block"></div>
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
		let { dragCfg, scrollCfg, onLoaded, resize, times } = this.props
		let {
			colors, list, waveRefresh,
			curP, checkP, statusP, checkC, statusC,
			childData, temporary,
			dragState,
			gridH,
			height,
		} = this.state
		let params = this.renderParams()
		let cursor = this.renderCursor()
		let helper = this.renderHelper()
		let gridStyle = this.getGridStyle()
		let waveStyle = { height }
		let conStyle  = { height: height + 24 }

		let hasData = list.filter(_ => !!_).length === list.length

		if (waveRefresh || !list.length || !hasData) {
			Object.assign(waveStyle, gridStyle)
		}
		return (
			<>
				<div className="wave-box">
					<div className="wb-content" style={conStyle}>
						<div className="wb-helper">
							{ helper }
						</div>
						<div className="wb-wave" onMouseDown={this.onMouseDown} onWheel={this.onWheel}>
							<div ref="wave" className="wb-wave-box" style={waveStyle}>
								{
									!waveRefresh && list.length && hasData
									? <WaveStacked dragCfg={dragCfg} scrollCfg={scrollCfg} colors={colors} list={list} times={times} gridH={gridH} gridStyle={gridStyle} onLoaded={onLoaded} />
									: null
								}
							</div>
						</div>
					</div>
					<div className="wb-ctrl" style={conStyle}>
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

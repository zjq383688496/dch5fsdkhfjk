import React from 'react'
import { withRouter } from 'react-router-dom'

import './index.less'

import Charts from '../Charts'
import Index  from '../Index'

class Box extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			waveState: false,
			waveValue: 'PAW',
			measureState: false,
			measureIndex: -1,
			wait: false,
			indexs: ['PEAK', 'VT', 'RR', 'FIO2']
		}
	}
	componentWillUnmount() {
		clearTimeout(this.timeout)
	}
	timeout = null
	toPage = ({ id }) => {
		if (!id) return
		this.props.history.push(`/detail/${id}`)
	}
	// 波形交互界面
	waveShow = (e, waveState) => {
		e.stopPropagation()
		this.setState({ waveState })
	}
	// 测量值交互界面
	measureShow = (e, measureIndex, measureState) => {
		e.stopPropagation()
		this.setState({ measureIndex, measureState })
	}
	// 重绘Charts
	reDraw = () => {
		clearTimeout(this.timeout)
		this.setState({ wait: true })
		this.timeout = setTimeout(() => {
			this.setState({ wait: false })
			clearTimeout(this.timeout)
		}, 1e2)
	}
	// 波形变化
	waveChange = (e, val) => {
		e.stopPropagation()
		let { waveValue } = this.state
		if (waveValue === val) return
		this.reDraw()
		this.setState({ waveValue: val })
		this.waveShow(e, false)
	}
	// 测量值变化
	measureChange = (e, key, measure) => {
		e.stopPropagation()
		let { indexs, measureIndex } = this.state
		if (indexs[measureIndex] === key) return 
		if (__Map__.not[key]) return this.measureShow(e, -1, false)
		indexs[measureIndex] = key
		this.setState({ indexs })
		this.measureShow(e, -1, false)
	}
	// 渲染观测选择器
	renderMeasure = measure => {
		let { m, not } = __Map__
		let { indexs, measureIndex } = this.state,
			cur = indexs[measureIndex]
		let mDom = Object.keys(m).map(key => {
			let { n: name } = m[key]
			return <p key={key} className={cur === key? 's-active': ''} onClick={e => this.measureChange(e, key, measure)}>{name}</p>
		})
		let nDom = Object.keys(not).map(key => {
			let { n: name } = not[key] || {}
			return <p key={key} className={cur === key? 's-active': ''} onClick={e => this.measureChange(e, key, measure)}>{name}</p>
		})
		return [ ...mDom, ...nDom ]
	}
	renderIndex = measure => {
		let { indexs, measureIndex } = this.state
		return indexs.map((key, i) => {
			return <Index key={i} title={key} data={measure} active={i === measureIndex} handleClick={e => this.measureShow(e, i, true)} />
		})
	}
	render() {
		let { waveState, waveValue, measureState, measureValue, wait } = this.state
		let { bedName, data } = this.props
		let { alarm, config, device = {}, measure, realTime, textMessage } = data,
			wave = __Map__.r[waveValue]

		return (
			<div className="dashboard-box">
				<div className="db-info fx h40 bc-blue c-white">
					<div className="db-info-item col-6 p4 pl8" onClick={e => this.toPage(device)}>
						<p className="fs12 lh12">床号:</p>
						<p className="fs20 lh20 ellipsis" title={bedName}>{bedName}</p>
					</div>
					<div className="db-info-item col-6 p4 pl8">
						<p className="fs20 lh32">{textMessage}</p>
					</div>
					<div className="db-info-item col-12 bc-red p8 pl20 fs24 lh24">
						<p className="fs-20 lh-20">{alarm[0]}</p>
					</div>
				</div>
				{
					waveState
					?
					<div className="db-info-wave fs16">
						<p onClick={e => this.waveChange(e, 'PAW')} className={waveValue === 'PAW'? 's-active': ''}>压力</p>
						<p onClick={e => this.waveChange(e, 'FLOW')} className={waveValue === 'FLOW'? 's-active': ''}>流量</p>
						<p onClick={e => this.waveChange(e, 'VOLUME')} className={waveValue === 'VOLUME'? 's-active': ''}>容量</p>
					</div>
					: null
				}
				{
					measureState
					?
					<div className="db-info-measure fs12">
						{ this.renderMeasure(measure) }
					</div>
					: null
				}
				{
					waveState || measureState
					?
					<div
						onClick={e => {
							this.waveShow(e, false)
							this.measureShow(e, -1, false)
						}}
						className="db-mask"
					></div>
					: null
				}
				{
					!wait && __VisibilityState__ === 'visible'
					?
					<Charts field={waveValue} config={config} realTime={realTime} handleClick={e => this.waveShow(e, true)} />
					: null
				}
				<div className="db-index fx h92 fs12">
					{ this.renderIndex(measure) }
				</div>
			</div>
		)
	}
}

export default withRouter(Box)
import React from 'react'
import './index.less'

import {
	StepBackwardOutlined,
	StepForwardOutlined,
	CaretLeftOutlined,
	CaretRightOutlined
} from '@ant-design/icons'

export default class Scrollbar extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			result: getResult(props.dom)
		}
	}
	scrollTo = num => {
		let { dom, scrollEnd, type } = this.props
		let typeExt = getType(type)
		let key = typeExt === 'v'? 'scrollTop': 'scrollLeft'
		let st  = dom[key]
		dom[key] = st + num
		let result = getResult(dom)
		this.setState({ result })
		scrollEnd && scrollEnd(result)
	}
	componentDidMount() {
		let result = getResult(this.props.dom)
		this.setState({ result })
	}
	componentDidUpdate() {
		let { result } = this.state
		let newResult = getResult(this.props.dom)
		if (objEqual(result, newResult)) return
		this.setState({ result: newResult })
	}
	render() {
		let {
			type, step = 50,
			onPrev,       onPrevAll,       onNext,       onNextAll,
			disabledPrev, disabledPrevAll, disabledNext, disabledNextAll
		} = this.props
		let { result } = this.state
		let typeExt = getType(type)
		let prevCss = typeExt === 'v'? 'bs-top': 'bs-left'
		let nextCss = typeExt === 'v'? 'bs-bottom': 'bs-right'
		let { prev, next } = getDisabled(result, typeExt)
		return (
			<div className={`scrollbar-box sb-${typeExt}`}>
				<div className="sb-content">
					<a className={`btn-scroll ${prevCss}`} disabled={disabledPrevAll != undefined? disabledPrevAll: prev} onClick={e => {
						if (onPrevAll) onPrevAll()
						else this.scrollTo(-999999)
					}}><StepBackwardOutlined/></a>
					<a className="btn-scroll"              disabled={disabledPrev != undefined? disabledPrev: prev} onClick={e => {
						if (onPrev) onPrev()
						else this.scrollTo(-step)
					}}><CaretLeftOutlined/></a>
					<div className="sb-bar"></div>
					<a className="btn-scroll"              disabled={disabledNext != undefined? disabledNext: next} onClick={e => {
						if (onNext) onNext()
						else this.scrollTo(step)
					}}><CaretRightOutlined/></a>
					<a className={`btn-scroll ${nextCss}`} disabled={disabledNextAll != undefined? disabledNextAll: next} onClick={e => {
						if (onNextAll) onNextAll()
						else this.scrollTo(999999)
					}}><StepForwardOutlined/></a>
				</div>
			</div>
		)
	}
}

function getType(type = 'v') {
	return ({
		v: 'v',
		h: 'h',
	})[type] || 'v'
}
function getResult(dom) {
	return {
		scrollTop:    Math.ceil(dom.scrollTop),
		scrollLeft:   Math.ceil(dom.scrollLeft),
		clientHeight: dom.clientHeight,
		scrollHeight: dom.scrollHeight,
		clientWidth:  dom.clientWidth,
		scrollWidth:  dom.scrollWidth,
	}
}
function getDisabled(result, type) {
	let dkey = type === 'v'? 'scrollTop': 'scrollLeft'
	let ckey = type === 'v'? 'clientHeight': 'clientWidth'
	let skey = type === 'v'? 'scrollHeight': 'scrollWidth'
	let dval = result[dkey]
	let cval = result[ckey]
	let sval = result[skey]
	let prev = dval === 0
	let next = cval === sval || dval + cval >= sval - 1
	return {
		prev,
		next,
	}
}
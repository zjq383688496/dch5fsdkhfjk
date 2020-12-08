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
	scrollTo = (num, type) => {
		let { dom, scrollEnd } = this.props
		let key = type === 'v'? 'scrollTop': 'scrollLeft'
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
		let { type, step = 50 } = this.props
		let { result } = this.state
		let typeExt = getType(type)
		let prevCss = typeExt === 'v'? 'bs-top': 'bs-left'
		let nextCss = typeExt === 'v'? 'bs-bottom': 'bs-right'
		let { prev, next } = getDisabled(result, typeExt)
		return (
			<div className={`scrollbar-box sb-${typeExt}`}>
				<div className="sb-content">
					<a className={`btn-scroll ${prevCss}`} disabled={prev} onClick={e => this.scrollTo(-999999, typeExt)}><StepBackwardOutlined/></a>
					<a className="btn-scroll"              disabled={prev} onClick={e => this.scrollTo(-step, typeExt)}><CaretLeftOutlined/></a>
					<div className="sb-bar"></div>
					<a className="btn-scroll"              disabled={next} onClick={e => this.scrollTo(step, typeExt)}><CaretRightOutlined/></a>
					<a className={`btn-scroll ${nextCss}`} disabled={next} onClick={e => this.scrollTo(999999, typeExt)}><StepForwardOutlined/></a>
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
		scrollTop:    dom.scrollTop,
		scrollLeft:   dom.scrollLeft,
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
	return {
		prev: dval === 0,
		next: cval === sval || dval + cval >= sval,
	}
}
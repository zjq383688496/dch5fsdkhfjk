import React from 'react'
import './index.less'

export default class Modal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			result: getResult(props.dom)
		}
	}
	// componentDidMount() {
	// 	let result = getResult(this.props.dom)
	// 	this.setState({ result })
	// }
	render() {
		let { data } = this.props
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
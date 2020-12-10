import React from 'react'
import './index.less'

export default class Modal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
		}
	}
	// componentDidMount() {
	// 	let result = getResult(this.props.dom)
	// 	this.setState({ result })
	// }
	onOk = () => {
		let { onOk } = this.props
		onOk && onOk()
	}
	onCancel = () => {
		let { onCancel } = this.props
		onCancel && onCancel()
	}
	onClose = () => {
		let { onClose } = this.props
		onClose && onClose()
	}
	onSelect = value => {
		let { onChange } = this.props
		onChange && onChange(value)
	}
	renderBtn = () => {
		let { dataSource = [], value = [], onBtnRender } = this.props
		let valMap = valueFormat(value)
		return dataSource.map((_, i) => {
			let { label, value } = _
			let text = onBtnRender? onBtnRender(_): label
			return <a key={i} className={`mb-btn${valMap[value]? ' s-active': ''}`} onClick={e => this.onSelect(_)}>{ text }</a>
		})
	}
	render() {
		let { dataSource, visible, title, style = {}, okText, cancelText } = this.props
		if (!visible) return null
		let btns = this.renderBtn()
		return (
			<div className="modal-box" style={style}>
				<div className="mb-header">
					{title}
					<a className="mb-close" onClick={this.onClose}>✕</a>
				</div>
				<div className="mb-content">{btns}</div>
				<div className="mb-bottom">
					<a className="mb-btn" onClick={this.onOk}>{ okText || '确定' }</a>
					<a className="mb-btn" onClick={this.onCancel}>{ cancelText || '取消' }</a>
				</div>
			</div>
		)
	}
}

function valueFormat(value) {
	let obj = {}
	value.forEach(_ => {
		obj[_] = true
	})
	return obj
}
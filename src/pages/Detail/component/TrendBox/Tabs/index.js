import React from 'react'
import './index.less'

export default class TabsBox extends React.Component {
	constructor(props) {
		super(props)
		let { tabs = [{ key: 1 }] } = props
		this.state = {
		}
	}
	onChange = key => {
		let { activeKey, onChange } = this.props
		if (activeKey == key) return
		onChange && onChange(key)
	}
	renderTabs = tabs => {
		let { activeKey } = this.props
		return tabs.map(({ active, key, name }) => {
			let cls = `tb-tab`
			if (activeKey == key) cls += ' s-active'
			if (!active) cls += ' s-disabled'
			return <div key={key} className={cls} onClick={() => this.onChange(key)}>{name}</div>
		})
	}
	render() {
		let { tabs } = this.props,
			tabsDom  = this.renderTabs(tabs)
		return (
			<div className="tabs-box">
				<div className="tb-tabs">
					{ tabsDom }
				</div>
			</div>
		)
	}
}

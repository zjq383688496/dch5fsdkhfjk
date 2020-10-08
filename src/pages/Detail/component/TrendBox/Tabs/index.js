import React from 'react'
import './index.less'

export default class TabsBox extends React.Component {
	constructor(props) {
		super(props)
		let { tabs = [{ key: 1 }] } = props
		this.state = {
			activeKey: tabs[0].key
		}
	}
	onChange = key => {
		let { onChange } = this.props
		let { activeKey } = this.state
		if (activeKey == key) return
		this.setState({ activeKey: key })
		onChange && onChange(key)
	}
	renderTabs = tabs => {
		let { activeKey } = this.state
		return tabs.map(({ key, name }) => {
			let cls = `tb-tab`
			if (activeKey == key) cls += ' s-active'
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

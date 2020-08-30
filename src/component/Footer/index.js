import React from 'react'
import './index.less'

export default class Footer extends React.Component {
	render() {
		let { style = {} } = this.props
		return (
			<div style={style} className="footer">Copyright © 2020 Draeger CoIN</div>
		)
	}
}
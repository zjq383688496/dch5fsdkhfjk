import React from 'react'

import './index.less'

import Box from './component/Box'

export default class Dashboard extends React.Component {
	constructor(props) {
		super(props)
	}
	componentDidMount() {
		this.task()
	}
	componentWillUnmount() {
		clearInterval(this.timeout)
	}
	timeout = null
	task = () => {
		this.timeout = setInterval(() => {
			let init = Math.random()
			this.setState({ init })
		}, __Interval__)
	}
	render() {
		let { Devices } = window.__Redux__
		if (!Devices.length) return null
		return (
			<div className="dashboard">
				{
					Devices.map((data, i) => {
						return <Box data={data} key={i} />
					})
				}
			</div>
		)
	}
}

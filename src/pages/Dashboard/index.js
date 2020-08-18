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
					new Array(16).fill().map((_, i) => {
						if (i === 0 && Devices[0]) {
							return <Box data={Devices[0]} key={i} />
						}
						if (i === 6 && Devices[1]) {
							return <Box data={Devices[1]} key={i} />
						}
						return (<div key={i}></div>)
					})
				}
				{
					/*Devices.map((data, i) => {
						return <Box data={data} key={i} />
					})*/
				}
			</div>
		)
	}
}

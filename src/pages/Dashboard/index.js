import React from 'react'

import './index.less'

import Box from './component/Box'

const defData = {
	alarm:    [],
	config:   {},
	device:   {},
	measure:  {},
	realTime: {},
}

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
		if (!__Grid__.length) return null
		// if (isEmptyObject(Devices)) return null
		return (
			<div className="dashboard">
				{
					__Grid__.map((grid, i) => {
						if (!grid) return <div key={i}></div>
						let device = Devices[grid.id] || deviceByGrid(grid.id)
						// if (!device) return <div key={i}></div>
						return <Box data={device} key={i} />
					})
				}
				<span className="demo fs36 p8">仅供测试非临床使用</span>
			</div>
		)
	}
}

function deviceByGrid(id) {
	let grid = __GridIndex__[id],
		data = deepCopy(defData)
	data.device = deepCopy(grid)
	return data
}

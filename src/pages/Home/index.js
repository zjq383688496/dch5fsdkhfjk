import React from 'react'

export default class Home extends React.Component {
	constructor(props) {
		super(props)
	}
	componentDidMount() {
		let { history } = this.props
		history.push('/dashboard')
	}
	render() {
		return null
	}
}
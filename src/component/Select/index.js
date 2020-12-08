import React from 'react'
import './index.less'

export default class Select extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
		}
	}
	// componentDidMount() {
	// }
	onSelect = value => {
		let { onChange } = this.props
		this.onVisible()
		onChange && onChange(value)
	}
	onVisible = () => {
		this.setState({ visible: !this.state.visible })
	}
	getValue = () => {
		let { dataSource = [], value } = this.props
		let name = ''
		for (let i = 0; i < dataSource.length; i++) {
			let da = dataSource[i]
			if (da.value === value) {
				name = da.label
				break;
			}
		}
		return name
	}
	renderOption = () => {
		let { dataSource = [], value } = this.props
		return dataSource.map((_, i) => {
			let val = _.value
			return <div key={i} className={`sb-option${value === val? ' s-active': ''}`} onClick={e => this.onSelect(val)}>{_.label}</div>
		})
	}
	render() {
		let { visible } = this.state
		let options = this.renderOption()
		return (
			<div className="select-box">
				<div className="sb-value" onClick={this.onVisible}>{this.getValue()}</div>
				{
					visible
					?
					<div className="sb-options">
						{ options }
					</div>
					: null
				}
				{
					visible
					?
					<div className="sb-mask" onClick={this.onVisible}></div>
					: null
				}
			</div>
		)
	}
}

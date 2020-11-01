import React from 'react'
import './index.less'

import Tabs       from './Tabs'
import Data       from './Data'
import Wave       from './Wave'
import WaveReview from './WaveReview'
import Notepad    from './Notepad'

const tabs = [
	{ key: 1, name: '趋势数据', active: false, },
	{ key: 2, name: '趋势波形', active: false, },
	{ key: 3, name: '波形回顾', active: true, },
	{ key: 4, name: '记录本',   active: true, },
]

export default class TrendBox extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			key: 3
		}
	}
	onChange = key => {
		this.setState({ key })
	}
	render() {
		let { device, bedName, onClose } = this.props
		let { key } = this.state
		return (
			<div className="trend-box">
				<div className="td-title">
					趋势/数据
					<a className="td-close" onClick={onClose}>✕</a>
				</div>
				<Tabs activeKey={key} tabs={tabs} onChange={this.onChange}/>
				<div className="tb-content">
					{ key == 1? <Data       device={device} bedName={bedName} />: null }
					{ key == 2? <Wave       device={device} bedName={bedName} />: null }
					{ key == 3? <WaveReview device={device} bedName={bedName} />: null }
					{ key == 4? <Notepad    device={device} bedName={bedName} />: null }
				</div>
			</div>
		)
	}
}

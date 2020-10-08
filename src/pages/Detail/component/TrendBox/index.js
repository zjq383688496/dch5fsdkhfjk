import React from 'react'
import './index.less'

import Tabs    from './Tabs'
import Data    from './Data'
import Wave    from './Wave'
import Notepad from './Notepad'

const tabs = [
	{ key: 1, name: '趋势数据' },
	{ key: 2, name: '趋势波形' },
	{ key: 3, name: '记录本' },
]

export default class TrendBox extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			key: 1
		}
	}
	onChange = key => {
		this.setState({ key })
	}
	render() {
		let { key } = this.state
		return (
			<div className="trend-box">
				<Tabs tabs={tabs} onChange={this.onChange}/>
				<div className="tb-content">
					{ key == 1? <Data />: null }
					{ key == 2? <Wave />: null }
					{ key == 3? <Notepad />: null }
				</div>
			</div>
		)
	}
}

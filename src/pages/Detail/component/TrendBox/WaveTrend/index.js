import React from 'react'
import './index.less'

import { Space, Spin } from 'antd'

import serviceApi from '@service/api'

import WaveBox from './WaveBox'

import Scrollbar from '@comp/Scrollbar'
import Select    from '@comp/Select'

import WaveTick  from './WaveTick'

import { codeMap, keyMap, options } from './config'

const colors2 = ['#138988', '#3559d4', '#50d1cb']

export default class WaveTrend extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: {},
			timeUnit:  'H2',
			scrollCfg: { scrollLeft: 0 },
			dragCfg:   null,
			current:   {},
			times:     [],
			loading:   false,
		}
	}
	timeout = null
	componentDidMount() {}
	componentWillUnmount() {
		clearInterval(this.timeout)
	}
	changeParams = params => {
		this.setState(params, this.getData)
	}
	getData = () => {
		let { m } = __Map__
		let { device }   = this.props,
			{ timeUnit } = this.state,
			{ wb1, wb2 } = this.refs,
			{ macAddress } = device,
			codes = Array.from(new Set([...wb1.state.checkC, ...wb2.state.checkC]))

		this.setState({ data: {}, times: [] })
		if (!codes.length) return// this.setState({ data: {}, times: [] })
			
		this.setState({ loading: true })

		let dataCodes = codes.map(code => codeMap[code]).join(',')

		serviceApi.getTrendView(macAddress, timeUnit, dataCodes).then(res => {
			let list = res || []
			let data = {}
			let len  = list.length
			list.forEach(measured => {
				let { dataCodeEnum } = measured
				let keyStr = dataCodeEnum.replace(/^MEASURED_DATA_P[\d]_/, '')
				let key = keyMap[keyStr]
				measured.key = key
				data[key] = measured
			})

			let times = this.getTimes? this.getTimes(list[0]): []
			this.setState && this.setState({ data, times, loading: false })
		}).catch(e => {
			this.setState && this.setState({ loading: false })
		})
	}
	getTimes = (data = {}) => {
		if (!data) return []
		return data.data.map(_ => _.timestamp)
	}
	getDom1 = dom => {
		this.$dom1 = dom
	}
	getDom2 = dom => {
		this.$dom2 = dom
	}
	getDom3 = dom => {
		this.$dom3 = dom
	}
	scrollEnd = scrollCfg => {
		let { scrollLeft } = scrollCfg
		let { $dom1, $dom2, $dom3 } = this
		if ($dom1) $dom1.scrollLeft = scrollLeft
		if ($dom2) $dom2.scrollLeft = scrollLeft
		if ($dom3) $dom3.scrollLeft = scrollLeft
		this.setState({ scrollCfg })
	}
	onDrag = dragCfg => {
		if (!dragCfg) return this.setState({ current: {}, dragCfg })
		let { idx, ratio } = dragCfg
		let { data, times } = this.state
		let current = {}
		Object.values(data).map(_ => {
			current[_.key] = _.data[idx]
		})
		current.timestamp = times[idx]
		this.setState({ current, dragCfg })
	}
	render() {
		let { $dom1, $dom2, $dom3 } = this
		let { current, data, timeUnit, times, scrollCfg, dragCfg, loading } = this.state
		let $dom   = $dom1 || $dom2
		let length = times.length
		let width  = $dom? $dom.clientWidth: 0
		return (
			<div className="wave-trend">
				<div className="wt-float">
					<Space size={20}>
						视图
						<Select
							value={timeUnit}
							dataSource={options}
							onChange={timeUnit => this.changeParams({ timeUnit })}
						/>
					</Space>
				</div>
				<div className="wt-content">
					<WaveBox ref="wb1" dom={$dom1} scrollCfg={scrollCfg} dragCfg={dragCfg} data={data} times={times} width={width} getData={this.getData} onLoaded={this.getDom1} onDrag={this.onDrag} cursor={current} />
					<WaveBox ref="wb2" dom={$dom2} scrollCfg={scrollCfg} dragCfg={dragCfg} data={data} times={times} width={width} getData={this.getData} onLoaded={this.getDom2} onDrag={this.onDrag} colors={colors2} />
					<div className="wt-tick">
						{
							$dom
							? <WaveTick times={times} onLoaded={this.getDom3} width={width} />
							: null
						}
					</div>
				</div>
				<div className="wt-bottom">
					{
						length && $dom && length > width
						?
						<Scrollbar
							dom={$dom}
							step={80}
							type={'h'}
							scrollEnd={this.scrollEnd}
						/>
						: null
					}
				</div>
				{ loading? <div className="wt-loading"><Spin/></div>: null }
			</div>
		)
	}
}

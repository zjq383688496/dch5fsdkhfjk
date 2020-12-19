import React from 'react'
import './index.less'

import { Space, Spin } from 'antd'

import moment from 'moment'

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
			dragCfg:   { idx: 0 },
			current:   {},
			times:     [],
			loading:   false,
			resize:    false,
		}
	}
	timeout = null
	timeout_resize = null
	componentDidMount() {
		window.addEventListener('resize', this.onResize.bind(this))
	}
	componentWillUnmount() {
		clearInterval(this.timeout)
		clearTimeout(this.timeout_resize)
		window.removeEventListener('resize', this.onResize.bind(this))
	}
	onResize = e => {
		clearTimeout(this.timeout_resize)
		let { $dom1, $dom2, state } = this
		let { scrollCfg } = state
		let dom = $dom1 || $dom2
		this.setState({ resize: true })
		this.timeout_resize = setTimeout(() => {
			this.setState({ resize: false })
		}, 90)
	}
	changeParams = params => {
		let { scrollCfg, dragCfg } = this.state
		scrollCfg.scrollLeft = 0
		dragCfg.idx = 0
		this.setState({ scrollCfg, dragCfg, ...params }, this.getData)
	}
	getData = startTime => {
		let { m } = __Map__
		let { device }   = this.props,
			{ timeUnit, current } = this.state,
			{ wb1, wb2 } = this.refs,
			{ macAddress } = device,
			startDate,
			codes = Array.from(new Set([...wb1.state.checkC, ...wb2.state.checkC]))

		if (!startTime) this.setState({ data: {}, times: [] })
		if (!codes.length) return// this.setState({ data: {}, times: [] })
			
		this.setState({ loading: true })

		let dataCodes = codes.map(code => codeMap[code]).join(',')

		if (startTime) {
			startDate = moment(startTime).format('YYYY-MM-DD HH:mm:ss')
		}

		serviceApi.getTrendView(macAddress, timeUnit, dataCodes, startDate).then(res => {
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

			if (startTime) {
				let {
					data:  oldData,
					times: oldTimes
				} = this.state
				Object.keys(oldData).forEach(key => {
					let old = oldData[key],
						cur = data[key]
					old.data.push(...cur.data)
				})
				oldTimes.push(...times)
				data  = oldData
				times = oldTimes
			} else {
				Object.values(data).map(_ => {
					current[_.key] = _.data[0]
				})
				current.timestamp = times[0]
			}

			this.setState && this.setState({ data, times, current, loading: false })
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
	getDom4 = dom => {
		this.$dom4 = dom
	}
	getGridH = () => {
		let { wb1, wb2 } = this.refs
		let wb = wb1 || wb2
		if (!wb) return 0
		return wb.gridH
	}
	scrollEnd = scrollCfg => {
		let { scrollLeft } = scrollCfg
		let { $dom1, $dom2, $dom3, $dom4 } = this
		if ($dom1) $dom1.scrollLeft = scrollLeft
		if ($dom2) $dom2.scrollLeft = scrollLeft
		if ($dom3) $dom3.scrollLeft = scrollLeft
		if ($dom4) $dom4.scrollLeft = scrollLeft
		this.setState({ scrollCfg })
	}
	onDrag = dragCfg => {
		if (!dragCfg) return this.setState({ current: {}, dragCfg })
		let { idx } = dragCfg
		let { data, times } = this.state
		let current = {}
		Object.values(data).map(_ => {
			current[_.key] = _.data[idx]
		})
		current.timestamp = times[idx]
		this.setState({ current, dragCfg })
	}
	render() {
		let { $dom1, $dom2 } = this
		let { current, data, timeUnit, times, scrollCfg, dragCfg, loading, resize } = this.state
		let $dom     = $dom1 || $dom2
		let length   = times.length
		let lastTime = times[times.length - 1]
		let width    = $dom? $dom.clientWidth: 0
		let gridH    = this.getGridH()
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
					<WaveBox ref="wb1" dom={$dom1} scrollCfg={scrollCfg} dragCfg={dragCfg} data={data} times={times} width={width} getData={this.getData} onLoaded={this.getDom1} onDrag={this.onDrag} cursor={current} resize={resize} />
					<div className="wt-tick">
						{ $dom1? <WaveTick times={times} onLoaded={this.getDom3} width={width} gridH={gridH} />: null }
					</div>
					<WaveBox ref="wb2" dom={$dom2} scrollCfg={scrollCfg} dragCfg={dragCfg} data={data} times={times} width={width} getData={this.getData} onLoaded={this.getDom2} onDrag={this.onDrag} cursor={current} resize={resize} colors={colors2} />
					<div className="wt-tick">
						{ $dom2? <WaveTick times={times} onLoaded={this.getDom4} width={width} gridH={gridH} />: null }
					</div>
				</div>
				<div className="wt-bottom">
					{
						length && $dom
						?
						<Scrollbar
							dom={$dom}
							step={80}
							type={'h'}
							nextCond={{
								time: lastTime,
								wait: 6e4,
								callback: () => this.getData(lastTime + 6e4)
							}}
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

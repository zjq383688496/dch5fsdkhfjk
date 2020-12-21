import React from 'react'
import './index.less'

import { Space, Spin } from 'antd'

import moment from 'moment'

import serviceApi from '@service/api'

import WaveBox from './WaveBox'

import Scrollbar from '@comp/Scrollbar'
import Select    from '@comp/Select'

import WaveTick  from './WaveTick'

import { codeMap, keyMap, options, multipleMap } from './config'

const colors2 = ['#138988', '#3559d4', '#50d1cb']
const defTimeUnit = 'H2'

export default class WaveTrend extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: {},
			timeUnit:  defTimeUnit,
			multiple:  getMultiple(defTimeUnit),
			scrollCfg: { scrollLeft: 0 },
			dragCfg:   { idx: 0 },
			current:   {},
			times:     [],
			curTimes:  [],
			page:      0,
			loading:   false,
			resize:    false,
		}
	}
	timeout = null
	timeout_resize = null
	componentDidMount() {
		window.addEventListener('resize', this.onResize.bind(this))
		this.task()
	}
	componentWillUnmount() {
		clearInterval(this.timeout)
		clearTimeout(this.timeout_resize)
		window.removeEventListener('resize', this.onResize.bind(this))
	}
	task = () => {
		clearInterval(this.timeout)
		this.timeout = setInterval(() => {
			let { times } = this.state
			if (!times.length) return
			let lastTime = times[times.length - 1]
			let diffTime = Date.now() - lastTime
			if (diffTime > 6e4) {
				// console.log('更新数据!')
				this.getData(lastTime + 6e4)
			}
		}, 1e4)
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
		let { dragCfg } = this.state
		dragCfg.idx = 0
		// this.setState({ dragCfg, ...params }, this.getData)
		this.setState({ dragCfg, ...params }, () => {
			this.onPage(this.state.multiple - 1)
		})
	}
	getData = startTime => {
		let { m } = __Map__
		let { device }     = this.props,
			{ current, multiple } = this.state,
			{ wb1, wb2 }   = this.refs,
			{ macAddress } = device,
			startDate,
			c1 = wb1? wb1.state.checkC: [],
			c2 = wb2? wb2.state.checkC: [],
			codes = Array.from(new Set([...c1, ...c2]))

		if (!startTime) this.setState({ data: {}, times: [] })
		if (!codes.length) return
			
		this.setState({ loading: true })

		let dataCodes = codes.map(code => codeMap[code]).join(',')

		if (startTime) startDate = moment(startTime).format('YYYY-MM-DD HH:mm:ss')

		clearInterval(this.timeout)
		serviceApi.getTrendView(macAddress, dataCodes, startDate).then(res => {
			let list = res || []
			let data = {}
			let len  = list.length
			list.forEach(measured => {
				let { dataCodeEnum } = measured
				let keyStr = dataCodeEnum.replace(/^MEASURED_DATA_P[\d]_/, '')
				let key = keyMap[keyStr]
				measured.key = key
				data[key]    = measured
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
					old._data.push(...cur.data)
					new Array(cur.data.length).fill().forEach(_ => old._data.shift())
				})
				oldTimes.push(...times)
				new Array(times.length).fill().forEach(_ => oldTimes.shift())
				data  = oldData
				times = oldTimes
			}

			let page = this.state.page
			if (!startTime) page = multiple - 1

			paging(data, multiple, page)
			let curTimes = timeing(times, multiple, page)

			current = this.getCurrent(this.state.dragCfg.idx || 0, data, curTimes)

			this.setState && this.setState({ current, curTimes, data, times, page, loading: false }, this.task)
		}).catch(e => {
			this.setState && this.setState({ loading: false }, this.task)
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
	// 拖拽
	onDrag = dragCfg => {
		if (!dragCfg) return this.setState({ current: {}, dragCfg })
		let { idx } = dragCfg
		let { data, curTimes } = this.state
		let current = this.getCurrent(idx, data, curTimes)
		this.setState({ current, dragCfg })
	}
	// 翻页
	onPage = page => {
		let { data, multiple, times, dragCfg: { idx } } = this.state
		paging(data, multiple, page)
		let curTimes = timeing(times, multiple, page)
		let current  = this.getCurrent(idx, data, curTimes)
		this.setState({ data, page, curTimes, current })
		// console.log('当前索引: ', page, idx, current)
	}
	getCurrent(idx, data, times) {
		let current = {}
		Object.values(data).map(_ => {
			current[_.key] = _.data[idx]
		})
		current.timestamp = times[idx]
		return current
	}
	render() {
		let { $dom1, $dom2 } = this
		let { current, data, timeUnit, times, scrollCfg, dragCfg, loading, resize, multiple, page, curTimes } = this.state
		let $dom   = $dom1 || $dom2
		let length = curTimes.length
		let width  = $dom? $dom.clientWidth: 0
		let gridH  = this.getGridH()
		return (
			<div className="wave-trend">
				<div className="wt-float">
					<Space size={20}>
						视图
						<Select
							value={timeUnit}
							dataSource={options}
							onChange={timeUnit => this.changeParams({ timeUnit, multiple: getMultiple(timeUnit) })}
						/>
					</Space>
				</div>
				<div className="wt-content">
					<WaveBox ref="wb1" dom={$dom1} scrollCfg={scrollCfg} dragCfg={dragCfg} data={data} times={curTimes} width={width} getData={this.getData} onLoaded={this.getDom1} onDrag={this.onDrag} cursor={current} multiple={multiple} resize={resize} />
					<div className="wt-tick">
						{ $dom1? <WaveTick times={curTimes} onLoaded={this.getDom3} width={width} multiple={multiple} gridH={gridH} />: null }
					</div>
					<WaveBox ref="wb2" dom={$dom2} scrollCfg={scrollCfg} dragCfg={dragCfg} data={data} times={curTimes} width={width} getData={this.getData} onLoaded={this.getDom2} onDrag={this.onDrag} cursor={current} multiple={multiple} resize={resize} colors={colors2} />
					<div className="wt-tick">
						{ $dom2? <WaveTick times={curTimes} onLoaded={this.getDom4} width={width} multiple={multiple} gridH={gridH} />: null }
					</div>
				</div>
				<div className="wt-bottom">
					{
						length && $dom
						?
						<Scrollbar
							dom={$dom}
							type={'h'}
							onPrevAll={e => this.onPage(0)}
							onPrev={e => this.onPage(page - 1)}
							onNext={e => this.onPage(page + 1)}
							onNextAll={e => this.onPage(multiple - 1)}
							disabledPrevAll={page === 0}
							disabledPrev={page === 0}
							disabledNext={page === multiple - 1}
							disabledNextAll={page === multiple - 1}
						/>
						: null
					}
				</div>
				{ loading? <div className="wt-loading"><Spin/></div>: null }
			</div>
		)
	}
}

function getMultiple(val = 'H2') {
	return multipleMap[val]
}

function paging(list, multiple, page = multiple - 1) {
	page = page > multiple - 1? multiple - 1: page
	page = page < 0? 0: page
	Object.values(list).forEach((_, i) => {
		let data    = _._data || _.data
		let newData = deepCopy(data)
		let size    = data.length / multiple
		let pages   = _.pages = new Array(multiple).fill().map(_ => {
			return newData.splice(0, size)
		})
		_._data = data
		_.data  = pages[page]
	})
}

function timeing(times, multiple, page = multiple - 1) {
	let size     = times.length / multiple
	let curTimes = times.slice(page * size, page * size + size)
	return curTimes || []
}

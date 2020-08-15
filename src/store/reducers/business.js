import * as types from '../constants'
import state from '@state'

var initialState = state
var { max, round } = Math

export default function business(state = initialState, action) {
	let {
		_this,
		global_data,
	} = action
	let {
		CurDevice,
		Devices,
		Cache
	} = state
	switch (action.type) {
		case types.DATA_UPDATE:
			// let { data = [] } = global_data
			// data2cache(data, Cache)
			return ReduxUpdate({})

		default:
			return ReduxUpdate()
	}
	function ReduxUpdate(o = {}) {
		let newState = Object.assign({}, state, o)
		// window.__Redux__.Config = newState
		return newState
	}
}

function data2cache(data, Cache) {
	data.forEach(device => {
		let { deviceId, deviceNo, userName, bedNo, attribute, series = [] } = device
		if (!Cache[deviceId]) Cache[deviceId] = { queues: [], index: {} }
		let cache = Cache[deviceId],
			{ index, lastId, queues } = cache,
			len = queues.length
		Object.assign(cache, {
			deviceId,
			deviceNo,
			userName,
			bedNo,
			attribute,
		})
		let last = series[series.length - 1]
		queues.push(...series)
		cache.lastId = last.id
		series.forEach(_ => index[_.id] = true)
	})
}
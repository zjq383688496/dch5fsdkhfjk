'use strict';

import * as types from '../constants'

export const dataUpdate = global_data => ({
	type: types.DATA_UPDATE,
	global_data
})

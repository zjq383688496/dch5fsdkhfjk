module.exports = {
	// 时间选项
	options: [
		{ label: '2h',    value: 'H2' },
		{ label: '4h',    value: 'H4' },
		{ label: '8h',    value: 'H8' },
		{ label: '12h',   value: 'H12' },
		{ label: '1D',    value: 'D1' },
		{ label: '7D',    value: 'D7' },
	],
	// code名称映射表
	codeMap: {
		'PEAK':     'MEASURED_DATA_P1_PEAK',
		'PPLAT':    'MEASURED_DATA_P1_PPLAT',
		'PMEAN':    'MEASURED_DATA_P1_PMEAN',
		'PEEP':     'MEASURED_DATA_P1_PEEP',
		'△P':       'MEASURED_DATA_P1_DELTA_P',
		'FIO2':     'MEASURED_DATA_P1_FIO2',
		'ETCO2':    'MEASURED_DATA_P1_ETCO2',
		'MVE':      'MEASURED_DATA_P1_MVE',
		'MVI':      '',
		'TI':       'MEASURED_DATA_P2_TI',
		'IE':       'MEASURED_DATA_P1_1E',
		'TCE':      '',
		'TPLAT':    'MEASURED_DATA_P1_TPLAT',
		'RR':       'MEASURED_DATA_P1_RR',
		'RRSPON':   '',
		'VTE':      'MEASURED_DATA_P2_VTE',
		'VTI':      '',
		'VT/kg BW': '',
		'PIF':      'MEASURED_DATA_P1_PIF',
		'PEF':      'MEASURED_DATA_P1_PEF',
		'C':        'MEASURED_DATA_P1_C',
		'R':        'MEASURED_DATA_P1_R',
		'RSB':      '',
	},
}
module.exports = Object.assign(window, {
	__Map__: {
		m: {
			ETCO2: {
				u: 'mmHg',		// % || mmHg
				n: 'etCO₂',
			},
			PEAK: {
				u: 'mbar',
				n: 'Peak',
			},
			PPLAT: {
				u: 'mbar',
				n: 'Pplat',
			},
			MVE: {
				u: 'L/min',
				n: 'MVe',
			},
			MVSPONT: {
				u: 'mbar',
				n: 'MVspont',
			},
			RR: {
				u: 'bpm',
				n: 'RR',
			},
			IE: {
				u: '',
				n: 'I:E',
			},
			FIO2: {
				u: '%',
				n: 'FiO₂',
			},
			R: {
				u: 'mbar',	// mbar || mbar/L/s
				n: 'R',
			},
			C: {
				u: 'mbar',	// mL || mL/mbar
				n: 'C',
			},
			VTE: {
				u: 'ml',
				n: 'Vte',
			},
			TI: {
				u: 's',
				n: 'Ti',
			},
		},
		r: {
			PAW:    {
				u: 'mbar',
				n: 'Paw',
			},
			FLOW:   {
				u: 'L/min',
				n: 'Flow',
			},
			VOLUME: {
				u: 'mL',
				n: 'Volume',
			},
			CO2:    {
				u: 'L/min',
				n: 'Co2',
			},
		},
		// 暂无
		not: {
			PEEP: {
				u: 'mbar',	// mbar
				n: 'Peep',
			},
			PMEAN: {
				u: 'mbar',
				n: 'Pmean',
			},
			VT: {
				u: 'mbar',
				n: 'VT',
			},
			VTSPON: {
				u: 'L/min',
				n: 'VTspon',
			},
			MVLEAK: {
				u: 'mbar',
				n: 'MVleak',
			},
			PIP: {
				u: 'bpm',
				n: 'PIP',
			},
			IPEAK: {
				u: '',
				n: 'ipeak',
			},
			'流量': {
				u: '%',
				n: '流量',
			},
			TPLAT: {
				u: 'mbar',	// mbar/L/s
				n: 'tplat',
			},
			RSB: {
				u: 'mL',	// mL/mbar
				n: 'RSB',
			},
			PPEAK: {
				u: 'mbar',
				n: 'Ppeak',
			},
		}
	}
})

__Map__.all = {
	...__Map__.m, ...__Map__.not
}

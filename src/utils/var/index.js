module.exports = Object.assign(window, {
	__Map__: {
		m: {
			// PIP: {
			// 	u: 'bpm',
			// 	n: 'PIP',
			// },
			PEAK: {
				u: 'mbar',
				n: 'PIP',	// Peak
			},
			PPLAT: {
				u: 'mbar',
				n: 'Pplat',
			},
			PMEAN: {
				u: 'mbar',
				n: 'Pmean',
			},
			PEEP: {
				u: 'mbar',
				n: 'PEEP',
			},
			'△P': {
				u: '',
				n: '△P',
			},
			// 三角P

			/* ----- */

			VTE: {
				u: 'ml',
				n: 'VTe',
			},
			// VTi
			VTI: {
				u: '',
				n: 'VTi',
			},
			// VTi
			MVE: {
				u: 'L/min',
				n: 'MVe',
			},
			// MVi
			MVI: {
				u: '',
				n: 'MVi',
			},
			// MVi
			ETCO2: {
				u: 'mmHg',
				n: 'etCO₂',
			},

			/* ----- */

			// PIF
			PIF: {
				u: '',
				n: 'PIF',
			},
			// PIF
			// PEF
			PEF: {
				u: '',
				n: 'PEF',
			},
			// PEF
			TI: {
				u: 's',
				n: 'Ti',
			},
			// ?
			IE: {
				u: '',
				n: 'I:E',
			},
			FIO2: {
				u: '%',
				n: 'FiO₂',
			},
			R: {
				u: 'mbar',
				n: 'R',
			},

			/* ----- */


			TPLAT: {
				u: 'mbar',	// mbar/L/s
				n: 'Tplat',
			},
			RR: {
				u: 'bpm',
				n: 'RR',
			},
			// RRspon
			RRSPON: {
				u: '',
				n: 'RRspon',
			},
			// RRspon
			// TCe
			TCE: {
				u: '',
				n: 'TCe',
			},
			// TCe
			C: {
				u: 'mbar',
				n: 'C',
			},
			RSB: {
				u: 'mL',
				n: 'RSB',
			},

			/* ----- */


			MVSPONT: {
				u: 'mbar',
				n: 'MVspont',
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
			IPEAK: {
				u: '',
				n: 'ipeak',
			},
			'流量': {
				u: '%',
				n: '流量',
			},
			PPEAK: {
				u: 'mbar',
				n: 'PIP',		// Ppeak
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
	}
})

__Map__.all = {
	...__Map__.m
}

let mockIdCache = {}

function mock(num = 16) {
	return {
		frequence: 1000,
		timestamp: Date.now(),
		data: new Array(num).fill().map((_, i) => {
			let id = i + 1,
				no = ('0' + id).slice(-2)
			if (!mockIdCache[id]) mockIdCache[id] = { max: 0 }
			let data = mockIdCache[id],
				{ max } = data
			return {
				id,
				deviceId: id,
				deviceNo: `D0${no}`,
				userName: `德尔格${id}`,
				bedNo:    20105 + i,
				attribute: {
					Paw: {
						unit: 'mbar',
						name: 'peak',
						max: '40',
						min: 'Auto',
						high: 80,
						low:  -20,
						value: randomRange(-20, 80),
					},
					Pplat: {},
					Peep: {
						value: randomRange(4, 6, 1),
					},

					MVe: {
						unit: 'bpm',
						name: '',
						value: randomRange(-20, 80),
					},
					Vte: {},
					CO2: {
						unit: 'mmhg',
						name: '',
						max: '6.1',
						min: '1.0',
						high: 12,
						low:  0,
						value: randomRange(1, 6.1, 1),
					},

					RR: {
						unit: 'bpm',
						name: '',
						max: '120',
						min: '50',
						value: randomRange(50, 120),
					},
					Ti: {},
					'2': {},


					FiO2: {
						unit: '%',
						name: '',
						value: randomRange(5, 8, 1),
					},
					R: {},
					C: {},


					VT: {
						name: '',
						max: 700,
						min: 0,
						// value: 800,
						value: randomRange(0, 700),
					},
					Volume: {
						name: 'MV',
						// unit: 'mL',
						// value: 6.1,
						high: 120,
						low:  -120,
						value: randomRange(1, 9, 1),
					},
					Flow: {
						name: '',
						max: 120,
						min: -120,
						high: 120,
						low:  -120,
						value: randomRange(60, 80),
					}
				},
				area: {
					Volume: {
						unit: 'mL',
						max: 10,
						min: 0,
						value: randomRange(1, 9),
					},
					Paw: {
						unit: 'mbar',
						max: 30,
						min: -5,
						value: randomRange(-1, 20),
					},
					Flow: {
						unit: '/min',
						max: 5,
						min: -5,
						value: randomRange(-4, 4),
					},
				},
				series: new Array(10).fill().map((_, l) => {
					let idx = l + 1,
						_id = max + idx

					++data.max

					return {
						id: _id,
						timestamp: Date.now(),
						Paw:  randomRange(40, 60),
						Flow: randomRange(-60, 80),
						CO2:  randomRange(1, 6.1, 1),
					}
				})
			}
		})
	}
}

module.exports = mock
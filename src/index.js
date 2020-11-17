import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { HashRouter } from 'react-router-dom'

import { hot } from 'react-hot-loader/root'

const render = Component => {
	ReactDOM.render(
		<HashRouter>
			<Component />
		</HashRouter>,
		document.querySelector('#app')
	)
}
render(App)
if (ENV === 'dev' && module.hot) {
	hot(App)
	// module.hot.accept('./routes.js', () => {
	// 	render(App)
	// })
}

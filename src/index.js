import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import reducer      from '@store/reducers'
import thunk        from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import { hot } from 'react-hot-loader/root'

const store = createStore(
	reducer,
	applyMiddleware(thunk),
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const render = Component => {
	ReactDOM.render(
		<HashRouter>
			<Provider store={store}>
				<Component />
			</Provider>
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

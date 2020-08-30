import React from 'react'
import { Switch, Route } from 'react-router-dom'

import routes from './routes'
// import { WS } from '@service'
import '@utils'
import 'antd/dist/antd.css'
import 'assets/common.less'

export default class App extends React.Component {
	constructor(props) {
		super(props)
	}
	componentDidMount() {
		// this.websocket()
	}
	// websocket = () => {
	// 	let socket = this.socket = WS()
	// }
	render() {
		return (
			<Switch>
				{
					routes.map(({ name, path, title, exact, component: Component, ...rest }) => (
						<Route key={path} path={path} exact={exact} render={props => {
							let { history, location: { pathname } } = props

							// 校验登录状态
							if (!window.__User__ && pathname != '/login') {
								history.push('/login')
							}
							document.title = `Drager - ${title}`
							return (<Component {...props} {...rest} />)
						}} />
					))
				}
			</Switch>
		)
	}
}
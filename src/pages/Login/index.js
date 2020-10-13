import React from 'react'
import './index.less'

import { Form, Input, Button, Checkbox, Tabs } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
const { Item }    = Form
const { TabPane } = Tabs

import serviceApi from '@service/api'
import Footer from '@comp/Footer'

import logo from 'assets/image/logo.png'


export default class Login extends React.Component {
	constructor(props) {
		super(props)
	}
	componentDidMount() {
		wsClear()
	}
	onFinish = values => {
		serviceApi.login(values).then(userInfo => {
			window.__User__ = userInfo
			this.props.history.push('/config')
		})
	}

	onFinishFailed = errorInfo => {
		console.log('Failed:', errorInfo)
	}
	render() {
		return (
			<>
				<div className="login">
					<img className="login-logo" src={logo} />
					<div className="login-main">
						<Tabs defaultActiveKey="1">
							<TabPane tab="账户密码登录" key="1">
								<Form
									name="basic"
									className="login-form"
									onFinish={this.onFinish}
									onFinishFailed={this.onFinishFailed}
								>
									<Item
										name="username"
										rules={[
											{
												required: true,
												message: '请输入账号',
											},
										]}
									>
										<Input placeholder="账户" prefix={<UserOutlined className="site-form-item-icon" />} />
									</Item>

									<Item
										name="password"
										rules={[
											{
												required: true,
												message: '请输入密码',
											},
										]}
									>
										<Input type="password" placeholder="密码" prefix={<LockOutlined className="site-form-item-icon" />} />
									</Item>

									<Item>
										<Button type="primary" htmlType="submit" className="login-form-button">登 录</Button>
									</Item>
								</Form>
							</TabPane>
						</Tabs>
					</div>
				</div>
				<Footer/>
			</>
		)
	}
}
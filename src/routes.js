import Home      from '@pages/Home'
import Login     from '@pages/Login'
import Config    from '@pages/Config'
import Dashboard from '@pages/Dashboard'
import Detail    from '@pages/Detail'

const routes = [
	{
		name:  'Home',
		title: '首页',
		path:  '/',
		exact: true,
		component: Home,
	},
	{
		name:  'Login',
		title: '登录',
		path:  '/login',
		exact: true,
		component: Login,
	},
	{
		name:  'Config',
		title: '大盘编辑',
		path:  '/config',
		exact: true,
		component: Config,
	},
	{
		name:  'Dashboard',
		title: '大盘',
		path:  '/dashboard',
		exact: true,
		component: Dashboard,
	},
	{
		name:  'Detail',
		title: '详情',
		path:  '/detail/:deviceId',
		exact: true,
		component: Detail,
		// fetchInitialData: () => video.list()
	},
]

export default routes
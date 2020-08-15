import Home      from '@pages/Home'
import Dashboard from '@pages/Dashboard'
import Detail    from '@pages/Detail'

const routes = [
	{
		name: 'Home',
		path: '/',
		exact: true,
		component: Home,
	},
	{
		name: 'Dashboard',
		path: '/dashboard',
		exact: true,
		component: Dashboard,
	},
	{
		name: 'Detail',
		path: '/detail/:deviceId',
		exact: true,
		component: Detail,
		// fetchInitialData: () => video.list()
	},
]

export default routes
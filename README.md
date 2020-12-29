# front-end-monitor

> 德尔格（draeger）监控系统

## 目录结构
```
static 编译用静态资源
|   ├─html2canvas.min.js
|   └─index.html
├─build 各环境编译配置
|   ├─webpack.base.js
|   ├─webpack.dev.js
|   ├─webpack.prod.js
|   ├─webpack.qa.js
|   └─webpack.rules.js
├─src
|  ├─App.js 主应用文件
|  ├─index.js 主应用入口文件
|  ├─routes.js 路由配置文件
|  cache 缓存相关方法
|  pages
|  |   ├─Config 4*4配置
|  |   ├─Dashboard 4*4
|  |   ├─Detail 详情
|  |   |    └─component
|  |   |         └─TrendBox 趋势相关
|  |   ├─Home 入口
|  |   ├─Login 登录
|  ├─utils
|  |   ├─business 业务相关方法
|  |   ├─var 公共变量
|  |   ├─ajax.js
|  |   ├─index.js
|  |   ├─global.js
|  ├─store
|  |   ├─getters.js
|  |   ├─index.js
|  |   ├─modules
|  |   |    ├─app.js
|  |   |    ├─settings.js
|  |   |    └user.js
|  ├─component
|  |     ├─Footer 公共底部
|  |     ├─Scrollbar 滚动条组件
|  |     └─Select 选择
|  ├─assets 静态资源(图片&样式)
|  ├─service
|  |  ├─api.js 所有请求
|  |  ├─mock.js 已失效
|  |  ├─storage.js 本地存储
|  |  ├─websocket.js
|  |  └WS.js 核心方法
├─.babelrc
├─.gitignore
├─package.json
├─README.md
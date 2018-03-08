var pkg = require('../package');

module.exports = {
	port: 8888,						// 端口
	
	session: {						// 内存信息
		secret: 'mosc',
		key: 'mosc',
		maxAge: 432000000			// 存储期限
	},
	
	admin:{							// 内置管理员
		_id: 'admin',				// 自定义管理员_id属性
		name: 'root',				// 管理员名称
		status: 'admin'				// 管理员身份识别字符串
	},
	
	limit:2,						// 后台文章列表显示条数
	
	system: {						// 系统信息
		bag: pkg.dependencies,		// node包安装
		version: process.version,	// node版本
		server: process.platform,	// 服务器环境
		dataTable: 'mosc',			// mongodb数据表
		views: 'ejs',				// 模版形式
		dataBase: 'mongodb'			// 数据库
	},
	
	mongodb: 'mongodb://localhost:27017/mosc'	// mongodb连接路劲
};
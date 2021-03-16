var pkg = require('../package');

module.exports = {
	port: 8888,						// 端口
	
	session: {						// 内存信息
		secret: 'mosc',
		key: 'mosc',
		maxAge: 86400000			// 存储期限1天
	},
	
	admin:{							// 内置管理员
		_id: 'admin',				// 自定义管理员_id属性
		name: 'root',				// 管理员名称
		password: 'admin',			// 管理员密码
		status: 'admin',			// 管理员身份识别字符串
		photo: '/face.jpg'			// 默认头像
	},
	
	system: {						// 系统信息
		bag: pkg.dependencies,		// node包安装
		version: process.version,	// node版本
		server: process.platform,	// 服务器环境
		dataTable: 'mosc',			// mongodb数据表
		views: 'ejs',				// 模版形式
		dataBase: 'mongodb'			// 数据库
	},
	
	mongodb: 'mongodb://localhost:27017/mosc'	// mongodb连接路径
};
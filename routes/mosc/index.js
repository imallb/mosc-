var check = require('../../middlewares/check-mosc');
var logs = require('../../middlewares/logs');

module.exports = function(app){
	app.get('/mosc', check.checkLogin, function(req, res, next){
		res.render('mosc');
	});
	// 登录登出
	app.use('/mosc/login', require('./login'));
	app.use('/mosc/loginout', require('./loginout'));
	// iframe页面，添加用户登录判断，防止可以使用链接直接打开iframe页面
	app.use('/mosc/home', check.checkLogin, require('./home'));
	app.use('/mosc/column', check.checkLogin, require('./column'));
	app.use('/mosc/article_list', check.checkLogin, require('./article_list'));
	app.use('/mosc/article_editor', check.checkLogin, require('./article_editor'));
	app.use('/mosc/system', check.checkLogin, require('./system'));
	app.use('/mosc/views', check.checkLogin, require('./views'));
	app.use('/mosc/template', check.checkLogin, require('./template'));
	app.use('/mosc/user_list', check.checkLogin, require('./user_list'));
	app.use('/mosc/message', check.checkLogin, require('./message'));
	// 清除缓存
	app.use('/mosc/clearsession', require('./clearsession'));
	// api接口
	app.use('/mosc/api', require('./api'));
	// 404 page
	app.use(function (req, res) {
		if (!res.headersSent) {
			var times= new Date().toLocaleString().replace(/\//g,'-');
			var date = times.split(/\s/)[0];
			var deviceAgent = req.headers["user-agent"].toLowerCase();
			var text = {};
			text.error = req.url;
			text.brower= deviceAgent;
			text.err   = 404;
			logs(date, text, 'error', times); // 添加404报错日志
			res.status(404).render('404');
		};
	});
};
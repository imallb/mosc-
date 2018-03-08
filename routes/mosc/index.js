var check = require('../../middlewares/check-mosc');
var logs = require('../../middlewares/logs');

module.exports = function(app){
	app.get('/mosc', check.checkLogin, function(req, res, next){
		res.render('mosc',{
			user_name:req.session.user.name
		});
	});
	// iframe页面
	app.use('/mosc/home', require('./home'));
	app.use('/mosc/login', require('./login'));
	app.use('/mosc/loginout', require('./loginout'));
	app.use('/mosc/column', require('./column'));
	app.use('/mosc/article_list', require('./article_list'));
	app.use('/mosc/article_editor', require('./article_editor'));
	app.use('/mosc/system', require('./system'));
	app.use('/mosc/views', require('./views'));
	app.use('/mosc/template', require('./template'));
	app.use('/mosc/user_list', require('./user_list'));
	app.use('/mosc/clearsession', require('./clearsession'));
	// api接口
	app.use('/mosc/api', require('./api'));
	// 404 page
	app.use(function (req, res) {
		if (!res.headersSent) {
			res.status(404).render('404');
		};
	});
};
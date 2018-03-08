var express = require('express');
var router  = express.Router();

// 登录页面
router.get('/', function(req, res, next){
	// 清空 session 中用户信息并且返回登录页面
	req.session.user = null;
	res.redirect('/mosc/login');
});

module.exports = router;
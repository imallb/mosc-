var express = require('express');
var router  = express.Router();

// 用户列表页面
router.get('/', function(req, res, next){
	res.render('mosc/message');
});

module.exports = router;
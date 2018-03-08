var sha1 = require('sha1');
var express = require('express');
var router  = express.Router();
var UserModel = require('../../models/users');
var check = require('../../middlewares/check-mosc');

// 登录页面
router.get('/', check.checkNotLogin, function(req, res, next){
	res.render('mosc/login');
});
router.post('/', function(req, res, next){
	var name= req.body.users;
	var password= req.body.password;
	
	UserModel.getUserByName(name)
		.then(function(user){
			
			if(!user){
				var config = require('config-lite');
				//console.log('用户不存在');
				if(name!=config.admin.name){
					console.log('管理员帐号错误！');
					return res.redirect('back');
				};
				if(password!='admin'){
					console.log('管理员密码错误！');
					return res.redirect('back');
				};
				var adminUser = config.admin;
				req.session.user = adminUser;
				return res.redirect('/mosc');
			}else{
				if(sha1(password)!=user.password){
					console.log('密码错误！');
					return res.redirect('back');
				};
				if(user.status!='admin'){
					console.log('只能管理员登录后台！');
					return res.redirect('back');
				};
				delete user.password;
				req.session.user = user;
				return res.redirect('/mosc');
			};
		})
		.catch(next);
});

module.exports = router;
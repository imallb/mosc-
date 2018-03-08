var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

var UserModel = require('../models/users');

// GET /signup 注册页
router.get('/', function(req, res, next) {
	res.render('signup');
});

// POST /signup 用户注册
router.post('/', function(req, res, next) {
	var name = req.body.users;
	var password = req.body.password;
	
	console.log(name)
	
	// 明文密码加密
	password = sha1(password);
	
	// 待写入数据库的用户信息
	var user = {
		name: name,
		password: password,
		status: "user"
	};
	// 用户信息写入数据库
	UserModel.create(user)
		.then(function (result) {
			// 此 user 是插入 mongodb 后的值，包含 _id
			user = result.ops[0];
			// 将用户信息存入 session
			delete user.password;
			req.session.user = user;
			// 写入 flash
			console.log('注册成功');
			// 创建个人文件夹
			var dir=path.resolve(__dirname, `../public/uploads/${user._id}`);
			fs.mkdir(dir,function(err){
				if (err) {
				   return console.error(err);
				};
				fs.mkdir(dir+'/images');
				fs.mkdir(dir+'/file');
				fs.mkdir(dir+'/video');
			});
			// 跳转到首页
			res.redirect('/index');
		})
		.catch(function (e) {
			// 用户名被占用则跳回注册页，而不是错误页
			if (e.message.match('E11000 duplicate key')) {
				console.log('用户名已被占用');
				return res.redirect('/signup');
			};
			next(e);
		});
	
});

module.exports = router;
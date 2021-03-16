var express = require('express');
var router  = express.Router();
var PostModel = require('../models/posts');
var UserModel = require('../models/users');
var ColumnModel = require('../models/column');
var MessageModel = require('../models/message');
var sha1 = require('sha1');

// index页面浏览
router.get('/', function(req, res, next){
	res.render('index');
});
// 获取文章列表
router.get('/article_list', function(req, res, next){
	var post = {};
	var userid = req.query.id;
	ColumnModel.getOneArticle(userid)
		.then(function(result){
			post.column = result;
			PostModel.getAllArticlez({'column':userid,'read':['off']})
				.then(function(data){
					post.data = data;
					res.json(post);
				})
				.catch(next);
		})
		.catch(next);
});
// 获取栏目
router.get('/column', function(req, res, next){
	var post = {};
	var page =(req.query.page!=undefined)?new Number(req.query.page)-0:1;
	var limit = (req.query.limit!=undefined)?new Number(req.query.limit)-0:1;
	var v =(page-1)*limit;
	
	ColumnModel.getLimitArticle({'read':['off']},limit,v)
		.then(function(data){
			post.posts = data;
			res.json(post);
		})
		.catch(next);
});
// 获取文章
router.get('/article/:postId', function(req, res, next){
	var post = {};
	var postId = req.params.postId;
	PostModel.getOneArticle(postId)
		.then(function(data){
			PostModel.updateArticle(postId,{ pv:data.pv+1 });
			post = data;
			post.pv = post.pv+1;
			res.json({
				static: 'success',
				data: post,
				message: '获取成功!'
			});
		})
		.catch(next);
});
// 登陆表单
router.get('/login',function(req, res, next){
	res.render('login');
});
// 登陆不跳转
router.post('/login', function(req, res, next){
	var name= req.body.users;
	var password= req.body.password;
	UserModel.getUserByName(name)
		.then(function(user){
			if(!user){
				var config = require('config-lite');
				if(name!=config.admin.name){
					return res.json({
						static:'error',
						message:'用户名错误!'
					});
				};
				if(password!=config.admin.password){
					return res.json({
						static:'error',
						message:'密码错误!'
					});
				};
				var adminUser = {};
				for(var i in config.admin){
					adminUser[i] = config.admin[i];
				};
				delete adminUser.password;
				req.session.user = adminUser;
			}else{
				if(sha1(password)!=user.password){
					return res.json({
						static:'error',
						message:'密码错误!'
					});
				};
				delete user.password;
				req.session.user = user;
			};
			return res.json({
				static:'success',
				message:'登陆成功!'
			});
		})
		.catch(next);
});
// 登出不跳转
router.get('/loginout', function(req, res, next){
	// 清空 session 中用户信息并且返回登录页面
	req.session.user = null;
	res.redirect('back');
});
// 分享页面
router.get('/share',function(req, res, next){
	res.render('share');
});
// 获取分页
router.get('/share/:postId',function(req, res, next){
	var post = [];
	var postId = req.params.postId;
	var page = req.query.page - 1;
	var limit = req.query.limit - 0;
	MessageModel.getLimitMessage({article:postId},limit,page)
		.then(function(data){
			data.forEach((p,i) => {
				post[i] = {};
				post[i].user = p.user;
				post[i].created_at = p.created_at;
				post[i].message = p.message;
			});
			res.json({
				static: 'success',
				data: data,
				message: '获取成功!'
			});
		})
		.catch(next);
});
// 获取分页数量
router.get('/share/count/:postId',function(req, res, next){
	var postId = req.params.postId;
	MessageModel.getCount({article:postId})
		.then(function(data){
			res.json({
				static: 'success',
				data: data,
				message: '获取成功!'
			});
		})
		.catch(next);
});
router.post('/share',function(req, res, next){
	var post = {
		column: req.body.column,
		article: req.body.article,
		author: req.body.author,
		user: req.body.user,
		title: req.body.title,
		paper: req.body.paper,
		message: req.body.message
	};
	MessageModel.create(post)
		.then(function(data){
			return res.json({
				static:'success',
				message:'留言成功!'
			});
		})
		.catch(next);
});
module.exports = router;

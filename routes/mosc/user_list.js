var path = require('path');
var fs = require('fs');
var express = require('express');
var router  = express.Router();
var UserModel = require('../../models/users');
var config = require('config-lite');

// 文章列表页面
router.get('/', function(req, res, next){
	UserModel.getCount({'name':{$ne:null}})
		.then(function(count){
			var post = {};
			post.list = count;
			post.limit=config.limit;
			res.render('mosc/user_list', {
				post: post
			});
		})
		.catch(next);
});

// 全部分页
router.get('/api', function(req, res, next) {
	var post = {};
	var page =(req.query.page!=undefined)?new Number(req.query.page)-0:1;
	var list = (req.query.limit!=undefined)?new Number(req.query.limit)-0:1;
	var v =(page-1)*list;
	
	UserModel.getLimitUser({},list,v)
		.then(function(data){
			post.posts = data;
			res.json(post);
		})
		.catch(next);
});

// 修改用户
router.post('/update', function(req, res, next) {
	var name = req.body.name;
	var val = req.body.val;
	
	UserModel.updateUser(name, {status: val});
});

module.exports = router;
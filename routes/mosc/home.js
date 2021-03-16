var path = require('path');
var fs = require('fs');
var express = require('express');
var router  = express.Router();
var PostModel = require('../../models/posts');
var UserModel = require('../../models/users');
var ColumnModel = require('../../models/column');

// 后台首页
router.get('/', function(req, res, next){
	var web = fs.readFileSync('information.txt','utf-8');
	var config = require('config-lite');
	
	PostModel.getLimitArticle({},5,0)
		.then(function(post){
			res.render('mosc/home',{
				system: config.system,
				web: eval('('+web+')'),
				post: post
			});
		})
		.catch(next);
});
// 所有文章
router.get('/allCount', function(req, res, next){
	var author = req.session.user._id;
	var post = {};
	if(req.session.user._id != 'admin'){
		post['author._id'] = req.session.user._id;
	};
	post['title'] = {$ne:null};
	PostModel.getCount(post)
		.then(function(count){
			res.send(count.toString());
		})
});
// 审核文章
router.get('/readCount', function(req, res, next){
	var post = {};
	if(req.session.user._id != 'admin'){
		post['author._id'] = req.session.user._id;
	};
	post['read'] = ['on'];
	PostModel.getCount(post)
		.then(function(count){
			count = count==''?0:count;
			res.send(count.toString());
		})
});
// 所有用户
router.get('/allUser', function(req, res, next){
	if(req.session.user._id != 'admin'){
		res.send('0');
	};
	UserModel.getCount({'name':{$ne:null}})
		.then(function(count){
			res.send(count.toString());
		})
});
// 所有栏目
router.get('/allColumn', function(req, res, next){
	var post = {};
	if(req.session.user._id != 'admin'){
		post['author._id'] = req.session.user._id;
	};
	post['title'] = {$ne:null};
	ColumnModel.getCount(post)
		.then(function(count){
			res.send(count.toString());
		})
});
// 审核文章
router.get('/readColumn', function(req, res, next){
	var post = {};
	if(req.session.user._id != 'admin'){
		post['author._id'] = req.session.user._id;
	};
	post['read'] = ['on'];
	ColumnModel.getCount(post)
		.then(function(count){
			count = count==''?0:count;
			res.send(count.toString());
		})
});

module.exports = router;

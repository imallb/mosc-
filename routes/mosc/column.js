var express = require('express');
var router  = express.Router();
var ColumnModel = require('../../models/column');
var PostModel = require('../../models/posts');
var MessageModel = require('../../models/message');

// 文章列表页面
router.get('/', function(req, res, next){
	var post = {};
	var page = (req.query.page!=undefined)?new Number(req.query.page)-0:1;
	
	post.page = page;
	res.render('mosc/column', {
		post: post
	});
});
// 栏目总数量
router.get('/count', function(req, res, next){
	var select = req.query.select;
	var search = req.query.search;
	var post = {};
	if(req.session.user._id != 'admin') post['author._id'] = req.session.user._id;
	if(search && search != '') post[select] = search;

	ColumnModel.getCount(post)
		.then(function(count){
			res.json({
				static:'success',
				data:count,
				message:'获取成功!'
			});
		})
		.catch(next);
});

// 提交信息
router.post('/', function(req, res, next){
	var title = req.body.title;
	var read  = (req.body.read == undefined)?['off']:req.body.read;
	
	var data = {
		author: req.session.user,
		title: title,
		read: read
	};
	ColumnModel.create(data)
		.then(function (result) {
			res.redirect('/mosc/column?page=1')
		})
		.catch(next);
});
// 修改信息
router.post('/column_change', function(req,res,next){
	var postId= req.query.id;
	var title = req.body.title;
	var read  = (req.body.read == undefined)?['off']:req.body.read;

	var data = {
		title: title,
		read: read
	};	
	ColumnModel.updateArticle(postId,data)
		.then(function(){
			res.redirect('back');
		})
		.catch(next);
	
});

// 删除
router.get('/delete', function(req, res, next){
	var postId = req.query.postId;
	PostModel.deleteAllArticle({'column':postId});
	MessageModel.deleteMessage({'column':postId});
	ColumnModel.deleteArticle(postId)
		.then(function () {
			res.json({
				static:'success',
				message:'删除成功!'
			});
		})
		.catch(next);
		
});

// 批量删除
router.post('/column_delete', function(req, res, next){
	var checklist= req.body.checklist;
	checklist.forEach(function(e,i){
		PostModel.deleteAllArticle({'column':e});
		MessageModel.deleteMessage({'column':e});
		ColumnModel.deleteArticle(e);
	});
	return res.json({
		static:'success',
		message:'删除成功!'
	});
});

module.exports = router;
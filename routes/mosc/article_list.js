var express = require('express');
var router  = express.Router();
var PostModel = require('../../models/posts');
var ColumnModel = require('../../models/column');

// 文章列表页面
router.get('/', function(req, res, next){
	var post = {};
	var postId = req.query.id;
	
	ColumnModel.getOneArticle(postId)
		.then(function(data){
			post.column = data;
			res.render('mosc/article_list', {
				post: post
			});
		})
	
});
// 文章列表页面
router.get('/article/:postId', function(req, res, next){
	var postId = req.params.postId;
	var page =(req.query.page!=undefined)?new Number(req.query.page)-0:1;
	var limit = (req.query.limit!=undefined)?new Number(req.query.limit)-0:1;
	var v =(page-1)*limit;

	PostModel.getLimitArticle({column:postId},limit,v)
		.then(function(result){
			res.json({
				static:'success',
				data:result,
				message:'获取成功!'
			});
		})
		.catch(next);
});
// 获取文章数量
router.get('/count', function(req, res, next){
	var postId = req.query.id;
	PostModel.getCount({column:postId})
		.then(function(count){
			res.json({
				static:'success',
				data:count,
				message:'获取成功!'
			});
		})
		.catch(next);
});

// 删除文章
router.get('/delete', function(req, res, next){
	var postId = req.query.id;

	PostModel.deleteArticle(postId)
		.then(function(){
			res.json({
				static:'success',
				message:'删除成功!'
			});
		})
		.catch(next);
});

// 批量删除
router.post('/article_delete/', function(req, res, next){
	var checklist= req.body.checklist;
	console.log(checklist)
	checklist.forEach(function(e,i){
		PostModel.deleteArticle(e)
	});
	return res.json({
		static:'success',
		message:'删除成功!'
	});
});

module.exports = router;
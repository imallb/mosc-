var express = require('express');
var router  = express.Router();
var PostModel = require('../../models/posts');
var ColumnModel = require('../../models/column');
var config = require('config-lite');

// 文章列表页面
router.get('/', function(req, res, next){
	var post = {};
	var userid = req.query.id;
	post.page = req.query.page;

	ColumnModel.getOneArticle(userid)
		.then(function(result){
			post.column = result;
			PostModel.getAllArticle({'column':userid})
				.then(function(data){
					post.data = data;
					res.render('mosc/article_list', {
						post: post
					});
				})
				.catch(next);
		})
		.catch(next);
});

// 删除文章
router.get('/delete', function(req, res, next){
	var postId = req.query.id;

	PostModel.deleteArticle(postId)
		.then(function(){
			res.redirect('back');
		})
		.catch(next);
});

// 批量删除
router.post('/article_delete/', function(req, res, next){
	var checklist= req.body.checklist;

	checklist.forEach(function(e,i){
		PostModel.deleteArticle(e)
			.then(function () {
				if( i==checklist.length-1 ){
					res.send('');
				}
			})
			.catch(next);
	});
});

module.exports = router;
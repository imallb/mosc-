var express = require('express');
var router  = express.Router();
var ColumnModel = require('../../models/column');
var config = require('config-lite');

// 文章列表页面
router.get('/', function(req, res, next){
	var page = (req.query.page!=undefined)?new Number(req.query.page)-0:1;
	
	ColumnModel.getCount({'title':{$ne:null}})
		.then(function(count){
			var post = {};
			post.list = count;
			post.page = page;
			post.limit= config.limit;
			res.render('mosc/column', {
				post: post
			});
		})
		.catch(next);
});

// 提交信息
router.post('/', function(req, res, next){
	var author = req.session.user;
	var title = req.body.title;
	var read  = (req.body.read == undefined)?[]:req.body.read;
	
	var data = {
		author: author,
		title: title,
		read: read
	};
	
	ColumnModel.create(data)
		.then(function (result) {
			//console.log(result)
			res.redirect('/mosc/column?page=1')
		})
		.catch(next);
});
// 修改信息
router.post('/column_change', function(req,res,next){
	var postId= req.query.id;
	var page = req.query.page
	var title = req.body.title;
	var read  = (req.body.read == undefined)?[]:req.body.read;

	var data = {
		title: title,
		read: read
	};
	
	ColumnModel.updateArticle(postId,data)
		.then(function(){
			res.redirect('/mosc/article_list?id='+postId+'&page='+page)
		})
		.catch(next);
	
});

// 删除
router.get('/delete', function(req, res, next){
	var postId = req.query.postId;
	var post = {};
	
	ColumnModel.deleteArticle(postId)
		.then(function () {
			ColumnModel.getCount({'title':{$ne:null}})
				.then(function(count){
					post.list = count;
					res.json(post);
				})
				.catch(next);
		})
		.catch(next);
		
});

// 批量删除
router.post('/column_delete/', function(req, res, next){
	var checklist= req.body.checklist;
	checklist.forEach(function(e,i){
		ColumnModel.deleteArticle(e)
			.then(function () {
				if( i==checklist.length-1 ){
					res.send('');
				}
			})
			.catch(next);
	});
});

module.exports = router;
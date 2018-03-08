var express = require('express');
var router  = express.Router();
var PostModel = require('../../models/posts');

// 文章编辑
router.get('/', function(req, res, next){
	var column = req.query.column;
	console.log(column)
	res.render('mosc/article_editor',{
		column: column
	});
});
// 文章编辑上传
router.post('/', function(req, res, next){
	var column = req.body.column;
	var title  = req.body.title;
	var key    = req.body.key;
	var paper  = req.body.paper;
	var content = req.body.content;
	var read   = (req.body.read == undefined)?[]:req.body.read;
	
	var data = {
		column: column,
		title: title,
		key: key,
		paper: paper,
		content: content,
		pv: 0,
		read: read
	};
	
	PostModel.create(data)
		.then(function (result) {
			res.redirect('/mosc/article_list?id='+column);
		})
		.catch(next);
});

// 文章修改
router.get('/:postId', function(req, res, next){
	var postId = req.params.postId;

	PostModel.getOneArticle(postId)
		.then(function(data){
			res.render('mosc/article_change', {
				post:data
			});
		})
		.catch(next);
});
// 修改提交
router.post('/:postId', function(req, res, next){
	var postId = req.params.postId;
	var column = req.body.column;
	var title  = req.body.title;
	var key    = req.body.key;
	var paper  = req.body.paper;
	var content = req.body.content;
	var read   = (req.body.read == undefined)?[]:req.body.read;

	var data = {
		title: title,
		key: key,
		paper: paper,
		content: content,
		read: read
	};
	
	PostModel.updateArticle(postId, data)
		.then(function(result){
			//console.log('修改成功');
			res.redirect('/mosc/article_list?id='+column);
		})
		.catch(next);
});

module.exports = router;
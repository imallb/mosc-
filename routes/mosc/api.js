var path = require('path');
var fs = require('fs');
var express = require('express');
var router = express.Router();
var PostModel = require('../../models/posts');
var ColumnModel = require('../../models/column');
var UserModel = require('../../models/users');
var muilter=require('../../middlewares/multer');
var config = require('config-lite');

// 全部分页
router.get('/column', function(req, res, next) {
	var page =(req.query.page!=undefined)?new Number(req.query.page)-0:1;
	var list = (req.query.limit!=undefined)?new Number(req.query.limit)-0:1;
	var v =(page-1)*list;

	var select = req.query.select;
	var search = req.query.search;
	var post = {};
	if(req.session.user._id != 'admin') post['author._id'] = req.session.user._id;
	if(search && search != '') post[select] = search;

	ColumnModel.getLimitArticle(post,list,v)
		.then(function(data){
			res.json({
				posts:data
			});
		})
		.catch(next);
});

// 缩略图和文件上传
router.post('/upload', function(req, res, next){
	var author = req.session.user._id;
	muilter(author).fields([
		{ name: 'file',maxCount: 1 }
	])(req, res, function(err){
		// 添加错误处理
		if (err) {
			return  console.log(err);
		};
		res.json(req.files['file'][0]);
	});
});

module.exports = router;
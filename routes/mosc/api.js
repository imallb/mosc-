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
	var post = {};
	var page =(req.query.page!=undefined)?new Number(req.query.page)-0:1;
	var list = (req.query.limit!=undefined)?new Number(req.query.limit)-0:1;
	var v =(page-1)*list;
	
	ColumnModel.getLimitArticle({},list,v)
		.then(function(data){
			post.posts = data;
			res.json(post);
		})
		.catch(next);
});

// 批量删除用户
router.post('/user_delete/', function(req, res, next){
	var deletefile = require('../../middlewares/deletefile');
	var checklist= req.body.checklist;

	for(var i=0;i<checklist.length;i++){
		UserModel.getUserByName(checklist[i])
			.then(function(post){
				// 用户文件夹
				var dir=path.join(__dirname, '../../public/uploads/')+post._id;
				var img=dir+'/images';
				var file=dir+'/file';
				var video=dir+'/video';
				
				deletefile(img);
				deletefile(file);
				deletefile(video);
				deletefile(dir);
				
				UserModel.deleteUser(post._id);
			}).catch(next);
	};
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
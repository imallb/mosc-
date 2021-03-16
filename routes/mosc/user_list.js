var path = require('path');
var fs = require('fs');
var express = require('express');
var sha1 = require('sha1');
var router  = express.Router();
var UserModel = require('../../models/users');

// 用户列表页面
router.get('/', function(req, res, next){
	res.render('mosc/user_list');
});

// 添加用户
router.post('/puser',function(req,res,next){
	var name = req.body.users;
	var password = req.body.password;
	// 明文密码加密
	password = sha1(password);
	
	// 待写入数据库的用户信息
	// 添加用户信息时默认添加系统头像
	var user = {
		name: name,
		password: password,
		status: "user",
		photo: '/face.jpg'
	};
	// 用户信息写入数据库
	UserModel.create(user)
		.then(function (result) {
			// 此 user 是插入 mongodb 后的值，包含 _id
			user = result.ops[0];
			// 创建个人文件夹
			var dir=path.resolve(__dirname, `../../public/uploads/${user._id}`);
			fs.mkdir(dir,function(err){
				if (err) {
				   return console.error(err);
				};
				fs.mkdir(dir+'/images',function(err){});
				fs.mkdir(dir+'/file',function(err){});
				fs.mkdir(dir+'/video',function(err){});
			});
			
			// 跳转
			// res.redirect('mosc/user_list');
			return res.json({
				static:'success',
				message:'创建成功！'
			});
		})
		.catch(function (e) {
			// 用户名被占用则跳回注册页，而不是错误页
			if (e.message.match('E11000 duplicate key')) {
				//console.log('用户名已被占用')
				return res.json({
					static:'error',
					message:'用户名已被占用！'
				});
			};
			next(e);
		});
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
// 全部总数
router.get('/count', function(req, res, next) {
	UserModel.getCount({})
		.then(function(count){
			res.json({
				static:'success',
				data:count,
				message:'获取成功!'
			});
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
	return res.json({
		static:'success',
		message:'删除成功!'
	});
});

// 修改用户
router.post('/update', function(req, res, next) {
	var name = req.body.name;
	var password = req.body.password;
	var status = req.body.status;
	var post = {};
	if(status != undefined){
		post.status = status;
	};
	if(password != undefined){
		post.password = sha1(password);
	};
	UserModel.updateUser(name, post);
	return res.json({
		static:'success',
		message:'修改成功！'
	});
});

module.exports = router;
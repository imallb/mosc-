var path = require('path');
var fs = require('fs');
var express = require('express');
var router  = express.Router();

// 网站模版编辑
router.get('/', function(req, res, next){
	var id = req.session.user._id;
	var url =(req.query.url!=undefined)?req.query.url:'';
	var dir = path.resolve(__dirname, '../../views'+url);
	
	fs.readFile(dir, 'utf-8', function(err, data){
		if(err){
			console.log(err);
		}else{
			res.render('mosc/template',{
				post: data,
				url: '/views'+url
			});
		}
	});
});
router.post('/', function(req, res, next){
	var id = req.session.user._id;
	
	if(id == 'admin'){
		var url = req.body.path;
		var text= req.body.text;
		var dir = path.resolve(__dirname, '../..'+url);
		fs.writeFile(dir, text, function(err){
			if(err){
				return res.json({
					static:'error',
					message:err
				});
			}else{
				return res.json({
					static:'success',
					message:'提交成功!'
				});
			}
		});
	}
});

module.exports = router;
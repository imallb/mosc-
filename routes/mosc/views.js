var path = require('path');
var fs = require('fs');
var express = require('express');
var router  = express.Router();

// 网站模版目录
router.get('/', function(req, res, next){
	var url =(req.query.url!=undefined)?req.query.url:'';
	var file = '/views'+url;
	var dir = path.resolve(__dirname, '../../views'+url);
	
	fs.readdir(dir,function(err,files){
		if(err){
			console.log(err);
			return;
		};
		var count = files.length;
		var post = {};
		files.forEach(function(filename){
			post[filename] = fs.statSync(dir+'/'+filename).mtime.toLocaleString();
		});
		res.render('mosc/views',{
			post: post,
			file: file,
			url: url
		});
	});
});

module.exports = router;
var path = require('path');
var fs = require('fs');
var express = require('express');
var router  = express.Router();
var Session = require('../../lib/mongo').Session;

// 清除缓存
router.get('/', function(req, res, next){
	
	var author = req.session.user._id;
	/*var date = req.session.date;
	var dir = path.join(__dirname, '../../logs');
	var files = {};
	files.success = fs.readdirSync(dir+'/success');
	files.error = fs.readdirSync(dir+'/error');

	for(var i in files){
		files[i].forEach(function(file){
			if(!new RegExp('('+date+')').test(file)){
				var filedir = path.join(dir, `/${i}/${file}`);
				fs.unlinkSync(filedir);
			}
		});
	};*/
	
	Session.find().sort({ _id: -1 }).exec()
		.then(function(post){
			var frist= 0;
			post.forEach(function(post){
				var obj = eval('('+post.session+')');
				if(obj.user == undefined){
					Session.remove({ _id: post._id }).exec();
				}else if( obj.user._id==author && frist==0 ){
					frist++;
				}else{
					Session.remove({ _id: post._id }).exec();
				};
			});
			res.json({'text':'缓存已清除！'});
		});
});

module.exports = router;
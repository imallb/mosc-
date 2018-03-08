var path = require('path');
var fs = require('fs');
var express = require('express');
var router  = express.Router();
var config = require('config-lite');

// 系统信息
router.get('/', function(req, res, next){
	var web = fs.readFileSync('information.txt','utf-8');

	res.render('mosc/system', {
		post:{
			system: config.system,
			web: eval('('+web+')')
		}
	});
});
router.post('/', function(req, res, next){	
	var data='{\r\n\r\n'+
		'  website: "'+req.body.website+'",\r\n\r\n'+
		'  ip: "'+req.body.ip+'",\r\n\r\n'+
		'  ftp: "'+req.body.ftp+'",\r\n\r\n'+
		'  key: "'+req.body.key+'",\r\n\r\n'+
		'  paper: "'+req.body.paper+'",\r\n\r\n'+
		'  record: "'+req.body.record+'",\r\n\r\n'+
		'  powerby: "'+req.body.powerby+'"\r\n\r\n'+
	'}';
	fs.writeFile('information.txt',data,function(err){
		if(err){
			console.log(err);
		}else{
			res.redirect('back');
		}
	});
});

module.exports = router;
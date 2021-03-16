'use strict';

var fs = require('fs');
var path= require('path');

module.exports = function(filename, record, status, times){
	// 文件名正则
	var fileExp = new RegExp('('+filename+')');
	// 存放文件的文件夹路径
	var dir = path.join(__dirname, `../logs/${status}/`);
	// 创建文件路径
	var dirFile = path.join(__dirname, `../logs/${status}/${filename}.log`);
	// 编写日志格式
	var timesText = ' [ '+times+' ] ';
	// 存放日志信息
	var text = '';
	// 收集当天生成日志的文件
	var arr = [];
	
	for(var i in record){
		text += timesText+i+': '+record[i]+'\r\n';
	};

	fs.exists(dirFile,function(exists){
		// 分割每一次访问生成日志
		text = text+'\r\n';
		// 日志文件是否存在，如果没有就新健一个
		if(exists){
			fs.readdir(dir, function(err, files){
				files.forEach(function(post){
					if(fileExp.test(post)){
						arr.push(post);
					};
				});
				arr.sort(function(a,b){return a-b});
				var filed = arr[arr.length-1];
				var stat = fs.statSync(dir+`/${filed}`);

				if(stat.size < 2097152){
					openFile(dir+`/${filed}`, text);
				}else{
					if( arr.length==1 ){
						filed = filename+'_2.log';
					}else if( arr.length>1 ){
						var arrExp = new RegExp('('+filename+'_)|(.log)','g');
						var number = new Number(filed.replace(arrExp, ''))+1;
						filed = filename+'_'+number+'.log';
					};
					fs.createWriteStream(dir+`/${filed}`);
					openFile(dir+`/${filed}`, text);
				};
			});
		}else{
			fs.createWriteStream(dirFile);
			openFile(dirFile, text);
		};
	});
	
	function openFile(filename, text){
		fs.open(filename,'a',function(err,fd){
			if(err){
				console.error(err);
			}else{
				fs.writeFileSync(fd,text);
				fs.closeSync(fd);
			}
		});
	};
};
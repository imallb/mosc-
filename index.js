'use strict';
var path = require('path');
var express = require('express');
var config = require('config-lite');
var routes = require('./routes/app');
var mosc = require('./routes/mosc');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var ueditor = require("ueditor");
var pkg = require('./package');
var bodyParser = require('body-parser');
var ueditor = require("ueditor");
var logs = require('./middlewares/logs');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 设置模板目录
app.set('views',path.join(__dirname, 'views'));
// 设置模板引擎为 ejs
app.set('view engine', config.system.views);
// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
// session 中间件
app.use(session({
	name: config.session.key,			// 设置 cookie 中保存 session id 的字段名称
	secret: config.session.secret,		// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
	resave: true,						// 强制更新 session
	saveUninitialized: false,			// 设置为 false，强制创建一个 session，即使用户未登录
	cookie: {
		maxAge: config.session.maxAge	// 过期时间，过期后 cookie 中的 session id 自动删除
	},
	store: new MongoStore({				// 将 session 存储到 mongodb
		url: config.mongodb				// mongodb 地址
	})
}));

// 编辑器上传文件
app.use("/ueditor/ueditor", ueditor(path.join(__dirname, 'public'), function(req, res, next) {
    var author = req.session.user._id;
	// ueditor 客户发起上传图片请求
    var ActionType = req.query.action;
    if(ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo'){
		//默认图片上传地址
        var file_url = `/uploads/${author}/images`;
        /*其他上传格式的地址*/
        if(ActionType === 'uploadfile'){
            file_url = `/uploads/${author}/file`;
        }
        if(ActionType === 'uploadvideo'){
            file_url = `/uploads/${author}/video`;
        }
        res.ue_up(file_url); // 你只要输入要保存的地址。保存操作交给ueditor来做
        res.setHeader('Content-Type','text/html');
    }
    //  客户端发起图片列表请求
    else if(req.query.action === 'listimage'){
        var dir_url = `/uploads/${author}/images`;
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }/*else if(req.query.action === 'listfile'){
        var dir_url = `/uploads/${author}/file`;
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }*/
    // 客户端发起其它请求
    else {
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/nodejs/config.json');
    }
}));

// 访问成功日志
app.use(function(req,res,next){
	var times= new Date().toLocaleString().replace(/\//g,'-');
	var date = times.split(/\s/)[0];
	var deviceAgent = req.headers["user-agent"].toLowerCase();
	req.session.date = date;
	var text = {};
	text.info = req.url;
	text.brower=deviceAgent;
	text.pid = process.pid;
	logs(date, text, 'success', times);
	next();
});

// 添加模板必需的变量
app.use(function (req, res, next) {
	res.locals.user = req.session.user;
	res.locals.pages = req.session.pages;
	next();
});

// 路由
routes(app);
mosc(app);

// error page && 网站错误日志
app.use(function (err, req, res, next) {
	var times= new Date().toLocaleString().replace(/\//g,'-');
	var date = times.split(/\s/)[0];
	var deviceAgent = req.headers["user-agent"].toLowerCase();
	var text = {};
	text.error = req.url;
	text.brower= deviceAgent;
	text.err   = err;
	logs(date, text, 'error', times);
	res.render('mosc/error', {
		error: err
	});
});

app.listen(config.port, function(){
	console.log(`${pkg.name} listening on port ${config.port}`);
});
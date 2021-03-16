module.exports = {
	checkLogin: function checkLogin(req, res, next){
		if(!req.session.user || req.session.user.status!='admin'){
			// console.log('未登录');
			return res.redirect('/mosc/login');
		};
		next();
	},
	checkNotLogin: function checkNotLogin(req, res, next){
		if(req.session.user && req.session.user.status=='admin'){
			// console.log('已登陆');
			return res.redirect('/mosc');
		};
		next();
	}
};
module.exports = function(app){
	app.get('/', function(req, res, next){
		res.redirect('index');
	});
	app.use('/index', require('./index'));
	app.use('/index.html', require('./index'));
	app.use('/signup', require('./signup'));
};
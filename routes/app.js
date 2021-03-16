module.exports = function(app){
	app.use('/', require('./index'));
	app.use('/index', require('./index'));
	app.use('/index.html', require('./index'));
};
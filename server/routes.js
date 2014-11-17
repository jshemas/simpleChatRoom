'use strict';

module.exports = function (app) {
	// All other get requests should be handled by AngularJS's client-side routing system
	app.get('/*', function(req, res){
		res.render('index', {'env': process.env.NODE_ENV});
	});
};
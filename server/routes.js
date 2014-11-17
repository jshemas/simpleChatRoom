'use strict';
var secret = require('../config/secret'),
	jwt = require('jwt-simple'),
	moment = require('moment');

module.exports = function (app) {
	// All other get requests should be handled by AngularJS's client-side routing system
	app.get('/*', function(req, res){
		res.render('index', {'env': process.env.NODE_ENV});
	});

	function userAuthorized(req, accessLevel, callback) {
		// if this is user or admin route, you must have authorization header
		if (accessLevel === 'user' && accessLevel === 'admin' && !req.headers.authorization) {
			return callback(false, null);
		}
		var role = 'public',
			payload = {};
		payload.sub = null;
		// if they have the auth header, lets get the token and update payload
		if (req.headers.authorization && req.headers.authorization.length > 0 && req.headers.authorization !== 'Bearer undefined') {
			var token = req.headers.authorization.split(' ')[1];
			payload = jwt.decode(token, secret.jwtSecret);
			role = payload.role;
			// is their token expired?
			if (payload.exp <= moment().unix()) {
				// should we delete their token?
				return callback(false, null);
			}
		}
		// check routes
		if (accessLevel === 'public') {
			return callback(true, payload.sub);
		} else if (accessLevel === 'user' && (role === 'user' || role === 'admin')) {
			return callback(true, payload.sub);
		} else if (accessLevel === 'admin' && role === 'admin') {
			return callback(true, payload.sub);
		} else {
			return callback(false, null);
		}
	}
};
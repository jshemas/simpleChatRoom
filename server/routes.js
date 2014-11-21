'use strict';

module.exports = function (app, io) {
	var listOfClients = {},
		clientUserName;
	io.sockets.on('connection', function (socket) {
		// console.log('Someone has connected!');
		socket.on('connection name',function(user) {
			clientUserName = user.name;
			listOfClients[user.name] = socket;
			// console.log(user.name + ' has joined');
			io.sockets.emit('new user', user.name);
		});
		socket.on('message', function(message) {
			// console.log('Message has been sent! The contents is:', message);
			io.sockets.emit('message', message);
		});
		socket.on('private message', function(message) {
			// console.log('Private message has been sent! The contents is:', message);
			var fromMessageObj = {
				from: clientUserName, 
				text: message.text
			};
			listOfClients[message.to].emit('private message', fromMessageObj);
		});
		socket.on('typing', function (user) {
			// console.log(user.name + ' is Typing');
			io.sockets.emit('typing', {
				name: user.name
			});
		});
		socket.on('stop typing', function (user) {
			// console.log(user.name + ' has stop Typing');
			io.sockets.emit('stop typing', {
				name: user.name
			});
		});
		socket.on('disconnect', function() {
			// console.log('User has Disconnected');
			delete listOfClients[clientUserName];
		});
	});
	// All other get requests should be handled by AngularJS's client-side routing system
	app.get('/*', function(req, res){
		res.render('index', {'env': process.env.NODE_ENV});
	});
};
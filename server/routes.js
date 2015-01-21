'use strict';

module.exports = function (app, io) {
	var listOfClients = {},
		listOfCurrentUsername = [];
	io.sockets.on('connection', function (socket) {
		var clientUserName;
		// console.log('Someone has connected!');
		socket.on('connection name',function(user) {
			clientUserName = user.name;
			// console.log(user.name + ' has joined');
			listOfClients[user.name] = socket;
			listOfCurrentUsername.push({'name':user.name});
			io.sockets.emit('new user', user.name);
			// console.log('add to user list: ', listOfCurrentUsername);
			io.sockets.emit('user list', {
				userList: listOfCurrentUsername
			});
			var time = ((new Date().getHours() + 11) % 12 + 1) + ':' + ((new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes()) + ' ' + (new Date().getHours() >= 12 ? 'pm' : 'am');
			io.sockets.emit('message', {
				content: 'has joined!',
				type: 'notify',
				time: time,
				name: clientUserName
			});
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
			// console.log(clientUserName,' has Disconnected');
			delete listOfClients[clientUserName];
			if (clientUserName !== undefined) {
				listOfCurrentUsername = listOfCurrentUsername.filter(function(user) {
					return user.name !== clientUserName;
				});
				// console.log('remove from user list: ', listOfCurrentUsername);
				io.sockets.emit('user list', {
					userList: listOfCurrentUsername
				});
				var time = ((new Date().getHours() + 11) % 12 + 1) + ':' + ((new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes()) + ' ' + (new Date().getHours() >= 12 ? 'pm' : 'am');
				io.sockets.emit('message', {
					content: 'has left!',
					type: 'notify',
					time: time,
					name: clientUserName
				});
			}
		});
	});
	// All other get requests should be handled by AngularJS's client-side routing system
	app.get('/*', function(req, res){
		res.render('index', {'env': process.env.NODE_ENV});
	});
};
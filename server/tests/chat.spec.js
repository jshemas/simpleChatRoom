var should = require('should'),
	io = require('socket.io-client'),
	socketURL = 'http://localhost:8080';

var options = {
	transports: ['websocket'],
	'force new connection': true
};

var chatUser1 = {'name':'Tom'},
	chatUser2 = {'name':'Jim'},
	chatUser3 = {'name':'Bob'};

describe('connection name && new user - ',function() {
	it('Should broadcast new user to all users', function(done) {
		var client1 = io.connect(socketURL, options);
		client1.on('connect', function(data) {
			client1.emit('connection name', chatUser1);
			var client2 = io.connect(socketURL, options);
			client2.on('connect', function(data) {
				client2.emit('connection name', chatUser2);
			});
			client2.on('new user', function(usersName) {
				usersName.should.equal(chatUser2.name);
				client2.disconnect();
			});
		});
		var numUsers = 0;
		client1.on('new user', function(usersName) {
			numUsers += 1;
			if (numUsers === 2) {
				usersName.should.equal(chatUser2.name);
				client1.disconnect();
				done();
			}
		});
	});
});

describe('message - ',function() {
	it('Should be able to broadcast messages', function(done){
		var client1, client2, client3,
			message = 'Hello World',
			messages = 0;
		var checkMessage = function(client) {
			client.on('message', function(msg) {
				message.should.equal(msg.content);
				client.disconnect();
				messages++;
				if (messages === 3) {
					done();
				};
			});
		};
		client1 = io.connect(socketURL, options);
		checkMessage(client1);
		client1.on('connect', function(data) {
			client2 = io.connect(socketURL, options);
			checkMessage(client2);
			client2.on('connect', function(data) {
				client3 = io.connect(socketURL, options);
				checkMessage(client3);
				client3.on('connect', function(data) {
					var time = ((new Date().getHours() + 11) % 12 + 1) + ":" + ((new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes()),
						messageObj = {
							content: message,
							time: time,
							type: 'message',
							name: chatUser3.name
						};
					client2.send(messageObj);
				});
			});
		});
	});
});

describe('private message - ',function() {
	it('Should be able to send private messages', function(done){
		var client1, client2, client3,
			message = {to: chatUser1.name, text:'Private Hello World'},
			messages = 0;
		var completeTest = function() {
			messages.should.equal(1);
			client1.disconnect();
			client2.disconnect();
			client3.disconnect();
			done();
		};
		var checkPrivateMessage = function(client) {
			client.on('private message', function(msg) {
				message.text.should.equal(msg.text);
				msg.from.should.equal(chatUser3.name);
				messages++;
				if(client === client1) {
					// The first client has received the message we give some time to ensure that the others will not receive the same message.
					setTimeout(completeTest, 40);
				};
			});
		};
		client1 = io.connect(socketURL, options);
		checkPrivateMessage(client1);
		client1.on('connect', function(data){
			client1.emit('connection name', chatUser1);
			client2 = io.connect(socketURL, options);
			checkPrivateMessage(client2);
			client2.on('connect', function(data){
				client2.emit('connection name', chatUser2);
				client3 = io.connect(socketURL, options);
				checkPrivateMessage(client3);
				client3.on('connect', function(data){
					client3.emit('connection name', chatUser3);
					client3.emit('private message', message)
				});
			});
		});
	});
});
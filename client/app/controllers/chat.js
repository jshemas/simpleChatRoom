angular.module('simpleChatRoom').controller('ChatCtrl', function ($scope, Socket) {
	$scope.createUserInfo = {};
	$scope.createMessageInfo = {};
	$scope.newUser = true;
	$scope.messages = [];
	$scope.setForm = function (form) {
		$scope.sendMessageForm = form;
	}
	Socket.on('message', function (data) {
		$scope.messages.push(data);
	});
	$scope.signup = function() {
		Socket.emit('connection name', {
			name: $scope.createUserInfo.username
		});
		$scope.newUser = false;
	};
	$scope.sendMessage = function() {
		var time = ((new Date().getHours() + 11) % 12 + 1) + ":" + new Date().getMinutes();
		Socket.emit('message', {
			content: $scope.createMessageInfo.content,
			time: time,
			name: $scope.createUserInfo.username
		});
		$scope.createMessageInfo.content = '';
		formReset($scope.sendMessageForm);
	};
	// reset form hack
	var formReset = function(form) {
		form.$pristine=true;
		form.$dirty=false;
		angular.forEach(form, function(input) {
			if (typeof(input.$dirty) !== "undefined") {
				input.$dirty = false;
				input.$pristine = true;
			}
		});
	}
});
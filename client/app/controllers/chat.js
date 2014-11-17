angular.module('simpleChatRoom').controller('ChatCtrl', function ($scope, Socket) {
	$scope.createUserInfo = {};
	$scope.createMessageInfo = {};
	$scope.newUser = true;
	$scope.messages = [];
	Socket.on('message', function (data) {
		$scope.messages.unshift(data);
	});
	$scope.signup = function() {
		Socket.emit('connection name', {
			name: $scope.createUserInfo.username
		});
		$scope.newUser = false;
	};
	$scope.sendMessage = function() {
		Socket.emit('message', {
			content: $scope.createMessageInfo.content,
			name: $scope.createUserInfo.username
		});
		$scope.createMessageInfo.content = '';
	};
});
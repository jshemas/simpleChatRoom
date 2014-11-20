angular.module('simpleChatRoom').controller('ChatCtrl', function ($scope, $timeout, Socket) {
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
	// Events for user typing
	var inputChangedPromise;
	$scope.isTypeing = false;
	$scope.wasTypeing = false;
	$scope.someoneTyping = {};
	$scope.inputChanged = function() {
		if(inputChangedPromise) {
			$scope.isTypeing = true;
			sendTypeingEvent();
			$timeout.cancel(inputChangedPromise);
		}
		inputChangedPromise = $timeout( function() {
			$scope.isTypeing = false;
			$scope.wasTypeing = false;
			sendTypeingEvent();
		},1000);
	}
	var sendTypeingEvent = function() {
		if ($scope.isTypeing === true && $scope.wasTypeing === false) {
			Socket.emit('typing', {
				name: $scope.createUserInfo.username
			});
			$scope.wasTypeing = true;
		} else if ($scope.isTypeing === false && $scope.wasTypeing === false){
			Socket.emit('stop typing', {
				name: $scope.createUserInfo.username
			});
		}
	}
	Socket.on('typing', function (data) {
		$scope.someoneTyping.push(data);
	});
	Socket.on('stop typing', function (data) {
		delete $scope.someoneTyping[data]
	});
});
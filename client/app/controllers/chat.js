angular.module('simpleChatRoom').controller('ChatCtrl', function ($scope, Socket) {
	Socket.on('init', function (data) {
		$scope.name = data.name;
	});
});
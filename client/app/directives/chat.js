angular.module('simpleChatRoom').directive('resize', function ($window) {
	return function (scope, element) {
		var windowCont = angular.element($window);
		var chatRoomContents = angular.element(document.getElementsByClassName('chat-room-contents'));
		scope.$watch(function () {
			return {
				'h': windowCont[0].innerHeight - 190,
				'w': chatRoomContents[0].outerWidth
			};
		}, function (newValue, oldValue) {
			scope.windowHeight = newValue.h;
			scope.windowWidth = newValue.w;
			scope.style = function () {
				return {
					'height': (newValue.h - 101) + 'px',
					'width': (newValue.w - 100) + 'px'
				};
			};
		}, true);
		w.bind('resize', function () {
			scope.$apply();
		});
	}
});
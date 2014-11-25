angular.module('simpleChatRoom').directive('resize', function ($window) {
	return function (scope, element) {
		var w = angular.element($window);
		scope.$watch(function () {
			return { 
				'h': w[0].innerHeight - 190,
				'w': w[0].outerWidth - 142
			};
		}, function (newValue, oldValue) {
			scope.windowHeight = newValue.h;
			scope.windowWidth = newValue.w;
			scope.style = function () {
				return { 
					'height': (newValue.h - 100) + 'px',
					'width': (newValue.w - 100) + 'px' 
				};
			};
		}, true);
		w.bind('resize', function () {
			scope.$apply();
		});
	}
});
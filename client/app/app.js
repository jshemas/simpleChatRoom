angular.module('simpleChatRoom', ['ngResource', 'ngMessages', 'ui.router', 'ui.bootstrap.dropdown', 'mgcrea.ngStrap.helpers.dimensions', 'mgcrea.ngStrap.modal', 'mgcrea.ngStrap.alert']).config(function($stateProvider, $urlRouterProvider) {
	$stateProvider.state('home', {
		url: '/',
		templateUrl: '../app/views/home.html'
	});
	$urlRouterProvider.otherwise('/');
});
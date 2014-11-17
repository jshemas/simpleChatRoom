angular.module('playground', ['ngResource', 'ngMessages', 'ui.router', 'ui.bootstrap.dropdown', 'mgcrea.ngStrap.helpers.dimensions', 'mgcrea.ngStrap.modal', 'mgcrea.ngStrap.alert', 'satellizer']).config(function($stateProvider, $urlRouterProvider, $authProvider) {
	$stateProvider.state('home', {
		url: '/',
		templateUrl: '../app/views/home.html'
	});

	$urlRouterProvider.otherwise('/');

	$authProvider.loginUrl = '/api/login';
	$authProvider.signupUrl = '/api/user';

	$authProvider.facebook({
		clientId: '657854390977827'
	});
	$authProvider.google({
		clientId: '631036554609-v5hm2amv4pvico3asfi97f54sc51ji4o.apps.googleusercontent.com'
	});
	$authProvider.twitter({
		url: '/auth/twitter'
	});
});
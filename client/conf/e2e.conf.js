// need to run this to download the standalone selenium server
// ./node_modules/grunt-protractor-runner/node_modules/protractor/bin/webdriver-manager update
// use browser.pause(); for debuging
exports.config = {
	allScriptsTimeout: 11000,
	specs: [
		'../tests/e2e/general.js',
	],
	capabilities: {
		'browserName': 'chrome'
	},
	directConnect: true,
	baseUrl: 'http://localhost:8081/',
	framework: 'jasmine',
	jasmineNodeOpts: {
		defaultTimeoutInterval: 30000
	}
};
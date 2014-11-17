'use strict';

describe('general site e2e - ', function() {
	describe('direct url hit - ', function() {
		it('should be able to get to the homepage by /#/ ', function() {
			browser.get('/#/');
			expect(browser.getLocationAbsUrl()).toMatch('/#/');
			expect(element.all(by.css('.panel-heading')).first().getText()).toMatch('HOME PAGE');
		});
	});
});
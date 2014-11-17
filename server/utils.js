'use strict';

module.exports = {
	/*
	 * validate var
	 * @param string var - user input
	 */
	validateVar: function (inputVar) {
		if (inputVar === null || (inputVar && inputVar.length < 1) || typeof inputVar === 'undefined' || !inputVar) {
			return false;
		} else {
			return true;
		}
	},

	/**
	 * validate number
	 * @param number num - user input: num
	 */
	validateNumber: function (num) {
		//word characters such as 0-9
		if (this.validateVar(num)) {
			var regex = /^\d+$/;
			if (regex.test(num)) {
				return;
			} else {
				return 'Invalid Number';
			}
		} else {
			return 'Invalid Number';
		}
	},

	/**
	 * validate username
	 * @param string username - user input: username
	 */
	validateUsername: function (username, notNeeded) {
		//word characters such as 0-9, A-Z, a-z, _
		//literal period
		//literal @
		//must have at least one letter
		//between 6 and 40 characters long
		if (this.validateVar(username)) {
			var regex = /^(?=.*[a-zA-Z])([a-zA-Z0-9.@_]+){6,40}$/;
			if (regex.test(username)) {
				return;
			} else {
				return 'Invalid Username';
			}
		} else if (notNeeded){
			return;
		} else {
			return 'Invalid Username';
		}
	},

	/**
	 * validate password
	 * @param string password - user input: password
	 */
	validatePassword: function (password, notNeeded) {
		//word characters such as 0-9, A-Z, a-z, _
		//literal period
		//literal @
		//between 6 and 40 characters long
		if (this.validateVar(password)) {
			var regex = /^[\w\.@]{6,40}$/;
			if (regex.test(password)) {
				return;
			} else {
				return 'Invalid Password';
			}
		} else if (notNeeded){
			return;
		} else {
			return 'Invalid Password';
		}
	},

	/**
	 * validate age check
	 * @param bool ageCheck - user input: ageCheck
	 */
	validateAgeCheck: function (ageCheck) {
		// should be true...
		if (this.validateVar(ageCheck)) {
			if (ageCheck === 'true') {
				return;
			} else {
				return 'Invalid Age Check';
			}
		} else {
			return 'Invalid Age Check';
		}
	},

	/**
	 * validate bool
	 * @param string bool - user input: bool
	 */
	validateBool: function (content) {
		//word characters such as 1 or 0
		//1 characters long
		if (content === 'true' || content === 'false') {
			return;
		} else {
			return 'Invalid Bool';
		}
	},

	/**
	 * validate id
	 * @param string id - user input: id
	 */
	validateId: function (id) {
		//word characters such as 0-9,
		//between 1 and 45 characters long
		if (this.validateVar(id)) {
			var regex = /^[0-9a-fA-F]{24}$/;
			if (regex.test(id)) {
				return;
			} else {
				return 'Invalid Id';
			}
		} else {
			return 'Invalid Id';
		}
	},

	/**
	 * mysqlRealEscapeString string
	 * @param string str - user input: string
	 */
	mysqlRealEscapeString: function (str) {
		var regex = /^\d{1,100}$/;
		if (regex.test(str)) {
			return str; //if str is a number, just return that
		} else {
			return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
				switch (char) {
				case '\0':
					return '\\0';
				case '\x08':
					return '\\b';
				case '\x09':
					return '\\t';
				case '\x1a':
					return '\\z';
				case '\n':
					return '\\n';
				case '\r':
					return '\\r';
				case '\"':
				case '\'':
				case '\\':
				case '%':
					return '\\' + char; // prepends a backslash to backslash, percent, and double/single quotes
				}
			});
		}
	},

	/*
	 * validate page number
	 * @param num var - inputNumber
	 * @param function callback
	 */
	validatePageNumber: function (inputNumber, callback) {
		//is there a number?
		if (this.validateVar(inputNumber)) {
			var regex = /^\d+$/;
			if (regex.test(inputNumber)) {
				if (inputNumber > 100) {
					callback(1); // shouldn't get any page passed 100
				} else {
					callback(inputNumber); // page number is fine
				}
			} else {
				// bad number enter, return page one
				callback(1);
			}
		} else {
			// no page number enter, return page one
			callback(1);
		}
	},

	/**
	 * validate email
	 * @param string email - user input: email
	 */
	validateEmail: function (email, notNeeded) {
		// http://www.regular-expressions.info/email.html
		if (this.validateVar(email)) {
			var regex = /[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\b/;
			if (regex.test(email)) {
				return;
			} else {
				return 'Invalid Email';
			}
		} else if (notNeeded){
			return;
		} else {
			return 'Invalid Email';
		}
	}
};
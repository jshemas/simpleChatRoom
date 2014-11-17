'use strict';

module.exports = function (grunt) {
	// Project configuration.
	grunt.initConfig({
		// backend linter
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			appFiles: {
				src: ['Gruntfile.js', 'app.js', 'config/*.js', '.jshintrc', 'package.json', 'config/*.js']
			},
			serverFiles: {
				src: ['server/*.js', 'server/models/*.js', 'server/controllers/*.js']
			},
			serverTests: {
				src: ['server/tests/*.js', 'server/tests/forum/*.js', 'server/tests/general/*.js', 'server/tests/qa/*.js']
			},
			clientFiles: {
				src: ['client/app/*.js', 'client/app/*.json', 'client/app/controllers/*.js', 'client/app/directives/*.js', 'client/app/services/*.js']
			},
			clientTests: {
				src: ['client/conf/e2e.conf.js', 'client/tests/e2e/*.js']
			}
		},
		// mocha tests (server)
		mochaTest: {
			options: {
				reporter: 'progress',
				bail: true
			},
			testIndex: {
				src: 'server/tests/index.spec.js'
			},
			testUser: {
				src: 'server/tests/user.spec.js'
			},
			testUserValue: {
				src: 'server/tests/general/user_value.spec.js'
			},
			testUserLoad: {
				src: 'server/tests/general/user_load.spec.js'
			},
			testMessage: {
				src: 'server/tests/message.spec.js'
			},
			testNotification: {
				src: 'server/tests/notification.spec.js'
			},
			testFlag: {
				src: 'server/tests/flag.spec.js'
			},
			testCategory: {
				src: 'server/tests/category.spec.js'
			},
			testTopic: {
				src: 'server/tests/topic.spec.js'
			},
			testPost: {
				src: 'server/tests/post.spec.js'
			},
			testForumLoad: {
				src: 'server/tests/forum/forum_load.spec.js'
			},
			testForumPagination: {
				src: 'server/tests/forum/post_pagination.spec.js'
			},
			testQuestion: {
				src: 'server/tests/question.spec.js'
			},
			testAnswer: {
				src: 'server/tests/answer.spec.js'
			},
			testVote: {
				src: 'server/tests/vote.spec.js'
			},
			testQALoad: {
				src: 'server/tests/qa/qa_load.spec.js'
			},
			testQAPaginate: {
				src: 'server/tests/qa/qa_paginate.spec.js'
			},
			testQASanitize: {
				src: 'server/tests/qa/qa_sanitize.spec.js'
			},
			testQATimeing: {
				src: 'server/tests/qa/qa_timeing.spec.js'
			},
			testQAValues: {
				src: 'server/tests/qa/qa_value.spec.js'
			}
		},
		// protractor e2e tests (client)
		protractor: {
			options: {
				configFile: 'node_modules/protractor/referenceConf.js',
				keepAlive: true,
				noColor: false,
				args: {}
			},
			e2e: {
				options: {
					configFile: 'client/conf/e2e.conf.js',
					args: {}
				}
			}
		},
		// move files from client and into dist
		copy: {
			dist: {
				cwd: 'client/app',
				src: [ '**' ],
				dest: 'dist/app',
				expand: true
			},
		},
		// clean(deletes) the dist folder
		clean: {
			dist: {
				src: ['dist/app']
			},
			styles: {
				src: ['dist/app/stylesheets/*.css', '!dist/app/stylesheets/app.css']
			},
			scripts: {
				src: ['dist/app/*.js', 'dist/app/controllers/*.js', 'dist/app/directives/*.js', 'dist/app/services/*.js', '!dist/app/app.js']
			}
		},
		// minifies CSS
		cssmin: {
			dist: {
				files: {
					'dist/app/stylesheets/app.css': 'client/app/stylesheets/*.css'
				}
			}
		},
		// minifies JS
		uglify: {
			dist: {
				options: {
					mangle: false
				},
				files: {
					'dist/app/app.js': ['client/app/*.js', 'client/app/controllers/*.js', 'client/app/directives/*.js', 'client/app/services/*.js', 'client/app/vendor/ngStrapHelpersDimensions.js', 'client/app/vendor/ngStrapModal.js', 'client/app/vendor/ngStrapAlert.js', 'client/app/vendor/ngStrap.tpl.js']
				}
			}
		},
		// express deploy
		express: {
			options: {
				port: 8080
			},
			dev: {
				options: {
					script: './app.js',
					node_env: 'dev',
					nospawn: true,
					delay: 5
				}
			},
			e2eprod: {
				options: {
					script: './app.js',
					node_env: 'prod',
					nospawn: true,
					port: 8081,
					delay: 5
				}
			},
			prod: {
				options: {
					script: './app.js',
					node_env: 'prod',
					background: false,
					delay: 5
				}
			}
		},
		// live watcher for file changes
		watch: {
			appFile: {
				files: ['Gruntfile.js', 'app.js', 'config/*.js'],
				tasks: ['jshint', 'default']
			},
			serverFiles: {
				files: ['server/*.js', 'server/models/*.js', 'server/controllers/*.js'],
				tasks: ['jshint', 'default']
			},
			serverTests: {
				files: ['server/tests/*.js', 'server/tests/forum/*.js', 'server/tests/general/*.js', 'server/tests/qa/*.js'],
				tasks: ['jshint', 'default']
			},
			clientFiles: {
				files: ['client/app/*.js', 'client/app/*.html', 'client/app/controllers/*.js', 'client/app/directives/*.js', 'client/app/services/*.js', 'client/app/stylesheets/*.css', 'client/app/vendor/*.js', 'client/app/views/*.html'],
				tasks: ['jshint', 'default']
			},
			express: {
				files:  [ 'server/*.js' ],
				tasks:  [ 'express:dev' ],
				options: {
					nospawn: true
				}
			}
		}
	});
	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-protractor-runner');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	// Tasks.
	grunt.registerTask('default', ['jshint', 'mochaTest:testIndex', 'mochaTest:testUser', 'mochaTest:testUserValue', 'mochaTest:testMessage', 'mochaTest:testNotification', 'mochaTest:testFlag', 'mochaTest:testQASanitize']);
	grunt.registerTask('testForum', ['jshint', 'mochaTest:testCategory', 'mochaTest:testTopic', 'mochaTest:testPost', 'mochaTest:testForumPagination']);
	grunt.registerTask('testQA', ['jshint', 'mochaTest:testQuestion', 'mochaTest:testAnswer', 'mochaTest:testVote', 'mochaTest:testQAValues', 'mochaTest:testQAPaginate']);
	grunt.registerTask('testAll', ['build', 'default', 'testQA', 'testForum', 'express:e2eprod', 'protractor:e2e']);
	grunt.registerTask('teste2e', ['build', 'express:e2eprod', 'protractor:e2e']);
	grunt.registerTask('testUserLoad', ['mochaTest:testUserLoad']);
	grunt.registerTask('testForumLoad', ['mochaTest:testForumLoad']);
	grunt.registerTask('testQALoad', ['mochaTest:testQALoad']);
	grunt.registerTask('testQATimeing', ['mochaTest:testQATimeing']);
	grunt.registerTask('dev', ['express:dev', 'watch']);
	grunt.registerTask('prod', ['build', 'express:prod']);
	grunt.registerTask('build', ['clean:dist', 'copy', 'cssmin', 'uglify', 'clean:styles', 'clean:scripts']);
	grunt.registerTask('testserver', 'run backend tests', function () {
		var tasks = ['default', 'watch'];
		// always use force when watching, this will rerun tests if they fail
		grunt.option('force', true);
		grunt.task.run(tasks);
	});
};
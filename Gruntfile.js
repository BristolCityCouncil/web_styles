module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		compassMultiple: {
			dev: {
				options: {
					config: 'config.rb',
					sassDir: 'scss',
					cssDir: 'css',
				}
			}
		},

		concat: {
			options: {
				separator: '\n',
			},
			js: {
				src: [
					'bcc-beta-theme/dev.js', // Liferay dependencies
					'bcc-beta-theme/js/common/vendor/priority/*.js',
					'bcc-beta-theme/js/common/vendor/*.js', 
					'bcc-beta-theme/js/common/widgets/*.js',
					'bcc-beta-theme/js/common/modules/*.js',
					'bcc-beta-theme/js/brand/modules/*.js',
					'bcc-beta-theme/js/services/modules/*.js',
					'bcc-beta-theme/js/brand/*.js', 
					'bcc-beta-theme/js/services/*.js',
					'bcc-beta-theme/js/services/testcases/*.js',
					'bcc-beta-theme/js/common/config.js',
					'bcc-beta-theme/js/services/config.js',
					'bcc-beta-theme/js/common/init.js',
					'bcc-beta-theme/js/brand/init.js',
					'bcc-beta-theme/js/services/init.js',
				],
				dest: 'bcc-beta-theme/js/main.pack.js', // all of the javascript, not minified.
			},
			css: {
				src: [
					'bcc-beta-theme/css/base.css',
					'bcc-beta-theme/css/aui.css',
					'css/custom.css',
				],
				dest: 'css/custom.pack.css', // All of the CSS, not minified.
			},
			staticEnv: {
				src: [
					'bcc-beta-theme/css/base.css',
					'bcc-beta-theme/css/aui.slim.css',
					'css/common.css',
				],
				dest: 'extra/STATIC/assets/css/style.pack.css',
			},
			staticEnvJS: {
				src: [
					'bcc-beta-theme/dev.js', // Liferay dependencies
					'bcc-beta-theme/js/common/vendor/priority/*.js',
					'bcc-beta-theme/js/common/vendor/*.js', 
					'bcc-beta-theme/js/common/widgets/*.js',
					'bcc-beta-theme/js/common/modules/*.js',
					'bcc-beta-theme/js/brand/modules/*.js',
					'bcc-beta-theme/js/services/modules/*.js',
					'bcc-beta-theme/js/brand/*.js', 
					'bcc-beta-theme/js/services/*.js',
					'bcc-beta-theme/js/services/testcases/*.js',
					'bcc-beta-theme/js/common/config.js',
					'bcc-beta-theme/js/services/config.js',
					'bcc-beta-theme/js/common/init.js',
					'bcc-beta-theme/js/brand/init.js',
					'bcc-beta-theme/js/services/init.js',
				],
				dest: 'extra/STATIC/assets/js/main.pack.js', // all of the javascript, not minified.
			},
			common: {
				src: [
					'bcc-beta-theme/css/base.css',
					'bcc-beta-theme/css/aui.slim.css',
					'css/common.css',
				],
				dest: 'css/common.pack.css',
			},
			custom: {
				src: [
					'bcc-beta-theme/css/base.css',
					'bcc-beta-theme/css/aui.css',
					'css/custom.css',
				],
				dest: 'css/custom.pack.css',
			}
		},

		uglify: {
			staticEnvJS: {
				files: {
					'extra/STATIC/assets/js/main.min.js': ['extra/STATIC/assets/js/main.pack.js']
				}
			},
			custom: {
				files: {
					'bcc-beta-theme/js/main.min.js': ['bcc-beta-theme/js/main.pack.js']
				}	
			}
		},

		/* CSS OPT */

		cmq: {
			custom: {
				files: {
					'css': ['css/custom.css']
				}
			},
			common: {
				files: {
					'css': ['css/common.css']
				}
			}
		},
		
		autoprefixer: {
			custom: {
				files: {
					'css/custom.pack.css' : ['css/custom.pack.css'],
				}
			},
			staticEnv: {
				files: {
					'extra/STATIC/assets/css/style.pack.css': ['extra/STATIC/assets/css/style.pack.css']
				}
			},
			common: {
				files: {
					'css/common.pack.css': ['css/common.pack.css']
				}
			}
		},

		cssmin: {
			custom: {
				files: {
					'css/custom.min.css': ['css/custom.pack.css'] // minified css
				}
			},
			staticEnv: {
				files: {
					'extra/STATIC/assets/css/style.min.css': ['extra/STATIC/assets/css/style.pack.css'] // minified css
				}
			},
			common: {
				files: {
					'css/common.min.css': ['css/common.pack.css']
				}
			}
		},

		// JSHint
		jshint: {
			all: ['Gruntfile.js', 'bcc-beta-theme/js/main.js'], // Only on main.js
		},

		// Watch File Changes
		watch: {
			sass: {
				files: ['scss/**/*.scss'],
				tasks: ['compassMultiple'],
			},
			jsconcat: {
				files: [
					'bcc-beta-theme/js/common/**/*.js',
					'bcc-beta-theme/js/brand/**/*.js',
					'bcc-beta-theme/js/services/**/*.js',
					'bcc-beta-theme/js/chrome/**/*.js',
					'bcc-beta-theme/js/main.js',
				],
				tasks: ['concat:js'],
			},
			jshint: {
				files: ['Gruntfile.js', 'bcc-beta-theme/js/main.js'],
				tasks: ['jshint:all'],
			},
			phpfiles: {
				files: ['templates/**/*.html']
			},
			options: {
				livereload: true,
			}
		},

		// Livereload
		livereload: {
			files: ['css/**/*.css', 'js/**/*.js', 'templates/**/*.html'],
			options: {
				interval: 800,
				livereload: true,
				spawn: false,
			},
		},

		// PHP Webserver
		php: {
			go: {
				options: {
					port: 8383,
					//bin: '/usr/local/php5/bin/php', // run "which php" on commandline if you are having problems.
					open: true,
					 hostname: '0.0.0.0',
					//hostname: '127.0.0.1', // Uncomment line for Windows
					router: 'index.php',
				}
			}
		},
		shell: {
			common: {
      			command: 'php tusk common',
      		},
      		custom: {
      			command: 'php tusk custom',
      		}
		}
		
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default', ['compassMultiple', 'jshint', 'php:go', 'watch']); // run dev environment
	grunt.registerTask('withnginx', ['compassMultiple', 'watch']);
	grunt.registerTask('common', ['cmq:common', 'concat:common', 'autoprefixer:common', 'cssmin:common']);
	grunt.registerTask('custom', ['cmq:custom', 'concat:custom', 'autoprefixer:custom', 'cssmin:custom']);
	grunt.registerTask('build', ['custom','common','shell:common']);
};

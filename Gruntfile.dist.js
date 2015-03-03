module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Compass

		compassMultiple: { // Mutlithreading.
			dev: {
				options: {
					config: 'config.rb',
					sassDir: 'scss',
					cssDir: 'css',
				}
			}
		},

		compass: {
			dev: {
				options: {
					config: 'config.rb',
					sourcemap: true, // doesnt work in compass version.
				}
			}
		},
		shell: {
			options: {
				stderr: false
			},
			pp: {
				command: function(num){
					return "git pull && git push";
				}
			},
			CPDP: {
				command: function(num){
					return "grunt deploy && git add ../. && git status && git commit -m \"Fixed #CPDP-"+num+"\"";
				}
			},
			BBCT: {
				command: function(num){
					return "grunt deploy && git add ../. && git status && git commit -m  \"Fixed #BBCT-"+num+"\"";
				}
			},
			all: {
				command: function(num){
					return "grunt deploy && git add ../. && git status && git commit -m \""+grunt.option('m')+"\"";
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
					'bcc-beta-theme/css/aui.css',
					'css/custom.css',
				],
				dest: 'STATIC/assets/css/style.pack.css',
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
				dest: 'STATIC/assets/js/main.pack.js', // all of the javascript, not minified.
			},
			common: {
				src: [
					'bcc-beta-theme/css/base.css',
					'bcc-beta-theme/css/aui.slim.css',
					'css/common.css',
				],
				dest: 'css/build/common.pack.css',
			}
		},
		uglify: {
			staticEnvJS: {
				files: {
				'STATIC/assets/js/main.min.js': ['STATIC/assets/js/main.pack.js']
				}
			}
		},

		csso: {
			staticEnv: {
				options: {
					report: 'gzip',
					restructure: true,
				},
				files: {
					'STATIC/assets/css/style.op.css': ['STATIC/assets/css/style.pack.css']
				}
			},
			common: {
				options: {
					report: 'gzip',
				},
				files: {
					'css/build/custom.op.css': ['css/build/custom.min.css']
				}	
			}
		},

		/* CSS OPT */

		cmq: {
			mainmin: {
				files: {
					'css/custom.pack.css': ['css/custom.css']
				}
			},
			common: {
				files: {
					'css/build': ['css/common.css']
				}
			}
		},
		// Autoprefixer - NOT USED
		autoprefixer: { // only on SCSS
			dev: {
				files: {
					'css/custom.pack.css' : ['css/custom.css'],
				}
			},
			staticEnv: {
				files: {
					'STATIC/assets/css/style.pack.css': ['STATIC/assets/css/style.pack.css']
				}
			},
			common: {
				files: {
					'css/build/common.pack.css': ['css/build/common.pack.css']
				}
			}
		},

		cssmin: {
			combine: {
				files: {
					'css/custom.min.css': ['css/custom.pack.css'] // minified css
				}
			},
			staticEnv: {
				files: {
					'STATIC/assets/css/style.min.css': ['STATIC/assets/css/style.pack.css'] // minified css
				}
			},
			common: {
				files: {
					'css/build/common.min.css': ['css/build/common.pack.css']
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
			files: ['css/**/*.css', 'js/**/*.js'],
			options: {
				interval: 800,
				livereload: true,
				spawn: false,
			},
		},

		// Sass
		sass: {
			dev: {
				files: {
					'css/custom.css' : 'scss/custom.scss'
				},
				sourceMap: true,
			}
		},

		// Rename files
		rename: {
			customcss: {
				src: 'build/css/custom.scss',
				dest: 'build/css/custom.css',
				options: {
					ignore: true,
				}
			},
			cssfolder: {
				src: 'build/scss',
				dest: 'build/css',
				options: {
					ignore: true,
				}
			},
			customcssREV: {
				src: 'tmpbuild/css/custom.css',
				dest: 'tmpbuild/css/custom.scss',
				options: {
					ignore: true,
				}
			},
			cssfolderREV: {
				src: 'tmpbuild/css',
				dest: 'tmpbuild/scss',
				options: {
					ignore: true,
				}
			}
		},

		// Build Process
		copy: {
			build: {
				files: [
					{expand: true, src: ['scss/**', 'images/**', 'fonts/**'], dest: 'build'},
					{expand: true, cwd: 'bcc-beta-theme', src:['js/**'], dest: 'build'}
				]
			},
			deploy: {
				files: [
					{expand: true, cwd: 'build/', src: ['js/**', 'images/**', 'fonts/**', 'css/**'], dest: '../src/main/webapp'},
				]
			},
			resynctemp: {
				files: [
					{expand: true, cwd: '../src/main/webapp', src: ['js/**','images/**', 'fonts/**', 'css/**'], dest: 'tmpbuild' },
				]
			},
			resync: {
				files: [
					{expand: true, cwd: 'tmpbuild', src: ['scss/**', 'images/**', 'fonts/**'], dest: '.'},
					{expand: true, cwd: 'tmpbuild', src:['js/**'], dest: 'bcc-beta-theme'}
				]
			},
			mixinshack: {
				files: [
					{expand: true, cwd: 'liferay_modules', src: ['_mixins.scss'], dest: 'scss'},
				]
			}
		},

		clean: {
			options: {force: true},
			all: ['build', 'css'],
			build: ['build'],
			tmpbuild: ['tmpbuild/**/*.*', 'tmpbuild'],
			mixinshack: ['scss/_mixins.scss'],
			//compile: ['../src/main/webapp/css'],
		},

		// Static Webserver
		connect: {
			server: {
				options: {
					port: 9001,
					base: '.'
				}
			}
		},
		// PHP Webserver
		php: {
			go: {
				options: {
					port: 8383,
					//bin: '/usr/local/php5/bin/php',
					open: true,
					 hostname: '0.0.0.0',
					//hostname: '127.0.0.1',
					router: 'index.php',
				}
			},
			gop: {
				options: {
					port: 8383,
					//bin: '/usr/local/php5/bin/php',
				}
			},
		},
		lineending: {
			eollf: {
				files: {
					'': ['../src/webapp/main/js/**/*', '../src/webapp/main/css/**/*']
				},
				options: {
					overwrite: true,
				},
			}
		},
		assemble: {
			options: {
				assets: 'assets',
				plugins: ['permalinks'],
				partials: ['./templates/**/*.html'],
				data: ['i/application/cache/json/store.json'],
				ext: '.html',
			},
			site: {
				src: ['templates/**/*.html'],
				dest: './docs/'
			}
		},
	});

	require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('assemble');

	grunt.registerTask('default', ['compassMultiple', 'jshint', 'php:go', /*'connect:server',*/  'watch']); // run dev environment
	grunt.registerTask('build', ['clean:build', 'clean:mixinshack','diffCopy:build', 'rename:cssfolder', 'rename:customcss', 'diffCopy:mixinshack']); // build without overwriting
	grunt.registerTask('compile', ['clean:build', 'clean:mixinshack', 'copy:build', 'rename:cssfolder', 'rename:customcss', 'diffCopy:deploy', 'copy:mixinshack', /* 'lineending:eollf', */]); // build + compile into liferay
	grunt.registerTask('resync', ['clean:tmpbuild', 'copy:resynctemp','rename:customcssREV', 'rename:cssfolderREV', 'diffCopy:resync', 'copy:mixinshack', 'clean:tmpbuild']);
	grunt.registerTask('publish', ['compile']);
	grunt.registerTask('deploy', ['compile']);
	grunt.registerTask('commit', 'shell:all');
	grunt.registerTask('jira', function(n, c){
		  grunt.task.run('shell:'+n+':'+c);
	});
	grunt.registerTask('pp', 'shell:pp');
	grunt.registerTask('css', [/*'cmq:mainmin'*/ 'autoprefixer:dev', 'cssmin:combine']);
	grunt.registerTask('withnginx', ['compassMultiple', 'watch']);

	grunt.registerTask('common', ['cmq:common', 'concat:common', 'autoprefixer:common', 'cssmin:common', 'csso:common']);
	//grunt.registerTask('clean', ['clean:all']); // Clean build directory
};

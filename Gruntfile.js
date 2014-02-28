/**
 * Bristol City Council Boilerplate Gruntfile.
 *
 * https://github.com/BristolCityCouncil/web_styles/blob/master/LICENSE
 */
module.exports = function(grunt) {

  'use strict';

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-liquid');
  grunt.loadNpmTasks('grunt-prettify');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-relative-root');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-rev');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: [
        'ui/js/**/*.js',
        '!ui/js/**/*.min.js',
        '!ui/js/vendor/**/*.js'
      ]
    },

    compass: {
      app: {
        options: {
          config: 'compass/config.rb'
        }
      }
    },

    clean: [
      'converted-html',
      'converted-html-prod'
    ],

    liquid: {
      pages: {
        options: {
          includes: './templates/includes/'
        },
        files: [
          {
            expand: true,
            flatten: false,
            cwd: 'templates',
            src: [
              '**/*.liquid',
              '!includes/**',
              '!layouts/**'
            ],
            dest: 'converted-html',
            ext: '.html'
          }
        ]
      }
    },

    'string-replace': {
      prod: {
        files: {
          './': 'converted-html-prod/**/*.html'
        },
        options: {
          replacements: [{
            pattern: /master.css"([ ]*)\/>(\n)([ ]+)<!\[endif\]-->/ig,
            replacement: function (match, p1, offset, string) {
              return 'master.css" />\n    <!--<![endif]-->';
            }
          }, {
            pattern: /<!--\[if gt IE 8\]>/ig,
            replacement: '<!--[if gt IE 8]><!-->'
          }]
        }
      },
      dist: {
        files: {
          './': 'converted-html/**/*.html'
        },
        options: {
          replacements: [{
            pattern: /a href=["|'](?!#)(.*?)["|']/ig,
            replacement: function (match, p1, offset, string) {
              var retString = '';
              if ( p1 === '#' ) {
                retString = match;
              }
              else if ( p1.substr(0, 5) === 'http:') {
                retString = match;
              }
              else if ( p1.substr(p1.length-1) === '/' ) {
                retString = match;
              }
              else if ( p1.match(/\.(.+)$/ig) ) {
                retString = match;
              }
              else {
                retString = match.replace(p1, p1 + '.html');
              }
              return retString;
            }
          }]
        }
      }
    },

    copy: {
      ui: {
        src: 'ui/**/*',
        dest: 'converted-html/'
      },
      content: {
        src: 'content/**/*',
        dest: 'converted-html/'
      },
      prod: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'converted-html',
          dest: 'converted-html-prod',
          src: [
            '**/*'
          ]
        }]
      }
    },

    relativeRoot: {
      generate: {
        options: {
          root: './converted-html'
        },
        files: [{
          expand: true,
          cwd: './',
          src: [
            './converted-html/**/*.html'
          ],
          dest: './'
        }]
      },
      prod: {
        options: {
          root: './converted-html-prod'
        },
        files: [{
          expand: true,
          cwd: './',
          src: [
            './converted-html-prod/**/*.html'
          ],
          dest: './'
        }]
      }
    },

    prettify: {
      options: {
        indent: 2,
        indent_char: ' ',
        wrap_line_length: 78,
        brace_style: 'expand',
        unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u', 'strong']
      },
      files: {
        expand: true,
        flatten: false,
        cwd: 'converted-html',
        src: [
          '**/*.html'
        ],
        dest: 'converted-html',
        ext: '.html'
      }
    },

    csslint: {
      build: {
        options: {
          absoluteFilePathsForFormatters: true,
          force: true,
          csslintrc: '.csslintrc',
          formatters: [
            {id: 'lint-xml', dest: '../logs/build-csslint.xml'}
          ]
        },
        src: ['converted-html/ui/css/**/*.css']
      },
      dev: {
        options: {
          csslintrc: '.csslintrc'
        },
        src: [
          'ui/css/**/*.css',
          '!**/*.min.css'
        ]
      }
    },

    watch: {
      js: {
        files: '<%= jshint.files %>',
        tasks: ['jshint']
      },

      compilesass: {
        files: 'ui/scss/**/*.scss',
        tasks: ['compass']
      }
    },

    rev: {
      dist: {
        files: {
          src: [
            'converted-html-prod/ui/js/bcc-cpp.js',
            'converted-html-prod/ui/css/master.css',
            'converted-html-prod/ui/css/master-oldie.css'
          ]
        }
      }
    },

    useminPrepare: {
      options: {
        dest: 'converted-html-prod'
      },
      html: 'converted-html/**/*.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['converted-html-prod/**/*.html'],
      options: {
        assetsDirs: ['converted-html-prod']
      }
    }
  });

  grunt.registerTask('default', ['watch']);

  /* The first stage build for integration - no optimisations applied */
  grunt.registerTask('build', [
    'clean',
    'compass',
    'liquid',
    'relativeRoot:generate',
    'string-replace:dist',
    'prettify',
    'copy'
  ]);

  /* The first stage build for staging and for delivery repo which contains production code */
  grunt.registerTask('build:prod', [
    'useminPrepare',
    'concat',
    'uglify',
    'cssmin',
    'rev',
    'usemin',
    'string-replace:prod',
    'relativeRoot:prod'
  ]);
};

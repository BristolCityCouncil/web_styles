/**
 * Bristol City Council Gruntfile to convert CPP code into boilerplate code suitable for commit to Github.
 */
module.exports = function(grunt) {

  'use strict';

  grunt.option("path", "boilerplate");

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
  grunt.loadNpmTasks('grunt-rename');

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    path: grunt.option("path"),

    copy: {
      release: {
        src: [
          '**/*',
          '!node_modules/**/*',
          '!{converted-html,converted-html-prod}/**/*',
          '!.sass-cache/**/*',
          '!.git/**/*',
          '!.tmp/**/*',
        ],
        dest: '<%= path %>/',
        dot: true,
        expand: true
      }
    },

    rename: {
      release: {
        src: '<%= path %>/templates/index-boilerplate.liquid',
        dest: '<%= path %>/templates/index.liquid'
      }
    },

    clean: {
      init: [
        "<%= path %>"
      ],
      release: [
        "<%= path %>/templates/sect-waste",
        "<%= path %>/templates/legacy",
        "<%= path %>/templates/alpha-home.liquid",
        "<%= path %>/templates/home.liquid",
        "<%= path %>/templates/index.liquid",
        "<%= path %>/node_modules",
        "<%= path %>/converted-html*",
        "<%= path %>/templates/sect-missed",
        "<%= path %>/.git",
        "<%= path %>/.tmp",
        "<%= path %>/.sass-cache",
        "<%= path %>/Gruntfile-build-boilerplate.js",
        "<%= path %>/README-*",
        "<%= path %>/ui/css",
        "<%= path %>/ui/images/temp",
        "<%= path %>/ui/images/waste",
        "<%= path %>/ui/fonts/the-sans",
        "<%= path %>/templates/email-templates/README.md",
        "<%= path %>/templates/email-templates/*.html"
      ]
    }
  });

  grunt.registerTask('complete', function() {
    grunt.log.ok('Boilerplate code ready in "' + grunt.option("path") + '"');
  });

  grunt.registerTask('default', [
    'clean:init',
    'copy:release',
    'clean:release',
    'rename:release',
    'complete'
  ]);
}

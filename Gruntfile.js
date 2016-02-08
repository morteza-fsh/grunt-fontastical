module.exports = function(grunt) {

    'use strict';

    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({

        clean: {
            output: ['output']
        },

        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        fontastical: {
            fontasticIcons: {
                options: {
                    fontKey : 'VYpoyvDYq2fpUYp8pHhiU4', // Font id
                    fontsDir: 'output', // Export fonts destination
                    scssDir : 'output', // Export SASS destination
                    jsonDir : 'output'  // Export JSON destination
                }
            }
        }
    });

    grunt.loadTasks('tasks');

    // register task
    grunt.registerTask( 'default', ['clean', 'fontastical']);
};

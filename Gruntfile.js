module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            options: {
                banner: "/*\n" +
                    " * jQuery MarkView v<%= pkg.version %>\n" +
                    " *\n" +
                    " * <%= pkg.homepage %>\n" +
                    " *\n" +
                    " * Copyright (c) <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
                    " * Released under the <%= _.map(pkg.licenses, 'type').join(', ') %> license\n" +
                    " */\n" +
                    "\n",
                separator: "\n"
            },
            js: {
                src: ["src/core.js"],
                dest: "dist/<%= pkg.name %>.js"
            },
            src: {
                src: ["src/css/github.css"],
                dest: "dist/<%= pkg.name %>.css"
            }
        },
        copy: {
            css: {
                expand: true,
                src: "src/font/octicons.woff",
                dest: "dist/",
                flatten: true,
                filter: "isFile"
            }
        },
        watch: {
            configFiles: {
                files: ['Gruntfile.js'],
                options: {
                    reload: true
                }
            },
            src: {
                files: ["src/**/*.js", "src/**/*.css"],
                tasks: [
                    "concat"
                ],
                options: {
                    livereload: true,
                },
            },
            test: {
                files: ["test/**/*.html", "test/**/*.md"],
                options: {
                    livereload: true,
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['concat', 'copy']);
    grunt.registerTask('develop', ['default', 'watch']);

};
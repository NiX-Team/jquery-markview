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
                files: "src/**/*.js",
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

    grunt.registerTask('default', ['concat']);
    grunt.registerTask('develop', ['concat', 'watch']);

};
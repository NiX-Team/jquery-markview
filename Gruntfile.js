module.exports = function (grunt) {

    var banner = "/*\n" +
        " * jQuery MarkView v<%= pkg.version %>\n" +
        " *\n" +
        " * <%= pkg.homepage %>\n" +
        " *\n" +
        " * Copyright (c) <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
        " * Released under the <%= _.map(pkg.licenses, 'type').join(', ') %> license\n" +
        " */\n";
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            options: {
                banner: banner + "\n",
                separator: "\n"
            },
            js: {
                src: ["src/core.js"],
                dest: "dist/<%= pkg.name %>.js"
            },
            css: {
                src: ["src/css/*.css"],
                dest: "dist/<%= pkg.name %>.css"
            },
            release: {
                src: ["dist/<%= pkg.name %>.min.css"],
                dest: "dist/<%= pkg.name %>.min.css"
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
        uglify: {
            options: {
                banner: banner + "\n"
            },
            js: {
                src: "dist/<%= pkg.name %>.js",
                dest: "dist/<%= pkg.name %>.min.js"
            }
        },
        cssmin: {
            options: {
                banner: banner
            },
            css: {
                expand: true,
                src: "dist/<%= pkg.name %>.css",
                ext: ".min.css"
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
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('release', ['default', 'uglify', 'cssmin', 'concat:release']);
    grunt.registerTask('default', ['concat:js', 'concat:css', 'copy']);
    grunt.registerTask('develop', ['default', 'watch']);

};

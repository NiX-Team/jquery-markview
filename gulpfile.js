var pkg = require('./package.json'),
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    header = require('gulp-header'),
    browserSync = require('browser-sync').create();

var banner = ['/**',
    ' * <%= pkg.title %> - <%= pkg.description %>',
    ' * @authors <%= pkg.author.name %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.licenses.type %>',
    ' */',
    ''
].join('\n');

gulp.task('concat-css', function () {
    return gulp.src('src/css/*.css')
        .pipe(concat(`${pkg.name}.css`))
        .pipe(gulp.dest('dist'));
});
gulp.task('concat-js', function () {
    return gulp.src('src/*.js')
        .pipe(concat(`${pkg.name}.js`))
        .pipe(gulp.dest('dist'));
});
gulp.task('minify-css', function () {
    return gulp.src(`dist/${pkg.name}.css`)
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cleanCSS())
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(gulp.dest('dist'));
});
gulp.task('minify-js', function () {
    return gulp.src(`dist/${pkg.name}.js`)
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(gulp.dest('dist'));
});
gulp.task('browser-reload', ['default'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('default', ['concat-css', 'concat-js']);
gulp.task('release', ['default'], function () {
    gulp.start(['minify-js', 'minify-css']);
});
gulp.task('develop', ['default'], function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch(["src/**/*", "test/**/*"], ['browser-reload']);
});

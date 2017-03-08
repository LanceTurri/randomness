'use strict';

var gulp = require('gulp');
var gulpif = require('gulp-if');
var debug = require('gulp-debug')
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var ext_replace = require('gulp-ext-replace');
var sourcemaps = require('gulp-sourcemaps');

var isDebugEnabled = true;

gulp.task('scss', function () {
  return gulp.src('Styles/*.scss')
    .pipe(sass())
    .pipe(gulpif(isDebugEnabled, debug({ title: 'CSS |' })))
    .pipe(gulp.dest('Styles'))
    .pipe(sourcemaps.init())
    .pipe(uglifycss())
    .pipe(ext_replace('.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('Styles'))
    .pipe(notify("SCSS task finished"))
    .on("error", notify.onError(function (error) {
      return "File: " + error.message;
    }));
});

gulp.task('js', function() {
  return gulp.src(['Scripts/*.js', '!Scripts/*.min.js', '!Scripts/vendor/*'])
    .pipe(gulpif(isDebugEnabled, debug({ title: 'JS |' })))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(ext_replace('.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('Scripts'))
    .pipe(notify("JS task finished"));
});

gulp.task('watch', function () {
  gulp.watch('Styles/*.scss', ['scss']);
  gulp.watch('Scripts/*.js', ['js']);
});

gulp.task('default', ['watch']);
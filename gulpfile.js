'use strict';

const gulp = require('gulp');
const gulpif = require('gulp-if');
const debug = require('gulp-debug')
const sass = require('gulp-sass');
const notify = require('gulp-notify');
const imagemin = require('gulp-imagemin');
const jshint = require('gulp-jshint');
const ts = require('gulp-typescript');
const uglify = require('gulp-uglify');
const uglifycss = require('gulp-uglifycss');
const ext_replace = require('gulp-ext-replace');
const sourcemaps = require('gulp-sourcemaps');

const isDebugEnabled = true;

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

gulp.task('ts', () => {
  return gulp.src('Scripts/*.ts')
    .pipe(gulpif(isDebugEnabled, debug({ title: 'TS |' })))
    .pipe(ts({
        noImplicitAny: true,
        out: 'app.js'
    }))
    .pipe(gulp.dest('Scripts'));
})


gulp.task('js', ['ts'], () => {
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
  gulp.watch('Scripts/*.ts', ['ts']);
});

gulp.task('default', ['watch']);
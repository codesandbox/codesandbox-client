const gulp = require('gulp');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const config = require('./config/paths');

gulp.task('css', function() {
  return gulp
    .src('src/homepage/**/*.css')
    .pipe(postcss([autoprefixer, cssnano]))
    .pipe(gulp.dest(`${config.appBuild}/`));
});

gulp.task('javascript', function() {
  return gulp
    .src('src/homepage/**/*.js')
    .pipe(gulp.dest(`${config.appBuild}/`));
});

gulp.task('html', function() {
  return gulp
    .src('src/homepage/**/*.html')
    .pipe(gulp.dest(`${config.appBuild}/`));
});

gulp.task('static', function() {
  return gulp
    .src(`${config.staticPath}/**/*`)
    .pipe(gulp.dest(`${config.appBuild}/`));
});

gulp.task('default', ['css', 'html', 'javascript', 'static']);

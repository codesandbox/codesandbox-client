const gulp = require('gulp');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const rev = require('gulp-rev');
const replace = require('gulp-replace');
const runSequence = require('run-sequence');

const config = require('./config/paths');

gulp.task('css', function() {
  return gulp
    .src('src/homepage/**/*.css')
    .pipe(postcss([autoprefixer, cssnano]))
    .pipe(rev())
    .pipe(gulp.dest(`${config.appBuild}/`))
    .pipe(rev.manifest())
    .pipe(gulp.dest(`${config.appBuild}/`));
});

gulp.task('javascript', function() {
  return gulp
    .src('src/homepage/**/*.js')
    .pipe(gulp.dest(`${config.appBuild}/`));
});

gulp.task('html', function() {
  const manifest = require(`${config.appBuild}/rev-manifest.json`);

  return gulp
    .src('src/homepage/index.html')
    .pipe(replace('static/css/main.css', manifest['static/css/main.css']))
    .pipe(gulp.dest(`${config.appBuild}/`));
});

gulp.task('static', function() {
  return gulp
    .src(`${config.staticPath}/**/*`)
    .pipe(gulp.dest(`${config.appBuild}/`));
});

gulp.task('build', function(cb) {
  return runSequence(['css', 'javascript', 'static'], 'html', cb);
});

gulp.task('default', ['build']);

const gulp = require('gulp');
const runSequence = require('run-sequence');

const config = require('./config/paths');

gulp.task('homepage', function() {
  return gulp
    .src('src/homepage/www/*.*')
    .pipe(gulp.dest(`${config.appBuild}/homepage`));
});

gulp.task('static', function() {
  return gulp
    .src(`${config.staticPath}/**/*`)
    .pipe(gulp.dest(`${config.appBuild}/`));
});

gulp.task('build', function(cb) {
  return runSequence(['homepage', 'static'], cb);
});

gulp.task('default', ['build']);

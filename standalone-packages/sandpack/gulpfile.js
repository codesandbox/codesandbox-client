const gulp = require('gulp');

gulp.task('copy-sandbox', () =>
  gulp
    .src([
      '../../www/**/*.*',
      '!../../www/**/*.map',
      '!../../www/stats.json',
      '!../../www/public/**/*.*',
    ])
    .pipe(gulp.dest('./sandpack/'))
);

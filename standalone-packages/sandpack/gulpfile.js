const gulp = require('gulp');

gulp.task('copy-sandbox', () =>
  gulp
    .src([
      '../../packages/app/www/**/*.*',
      '!../../packages/app/www/**/*.map',
      '!../../packages/app/www/stats.json',
      '!../../packages/app/www/public/**/*.*',
    ])
    .pipe(gulp.dest('./sandpack/'))
);

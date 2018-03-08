const gulp = require('gulp');

gulp.task('copy-sandbox', () =>
  gulp
    .src([
      '../app/www/**/*.*',
      '!../app/www/**/*.map',
      '!../app/www/stats.json',
      '!../app/www/public/**/*.*',
    ])
    .pipe(gulp.dest('./sandpack/'))
);

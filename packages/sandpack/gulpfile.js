const gulp = require('gulp');

gulp.task('copy-sandbox', () =>
  gulp.src('../app/www/**/*.*').pipe(gulp.dest('./sandpack/'))
);

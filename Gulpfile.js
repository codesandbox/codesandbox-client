const gulp = require('gulp');

gulp.task('app', function() {
  return gulp.src('packages/app/www/**/*').pipe(gulp.dest('www'));
});

gulp.task('homepage', function() {
  return gulp.src('packages/homepage/public/**/*').pipe(gulp.dest('www'));
});

gulp.task('default', ['app', 'homepage']);

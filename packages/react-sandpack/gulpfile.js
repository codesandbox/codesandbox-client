const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');

gulp.task('sass', () =>
  gulp
    .src('./src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('./dist/'))
);

gulp.task('sass:watch', () => gulp.watch('./src/**/*.scss', ['sass']));

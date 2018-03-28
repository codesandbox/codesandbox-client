const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const cssimport = require('gulp-cssimport');
const prettier = require('gulp-plugin-prettier');

gulp.task('sass', () =>
  gulp
    .src('./src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssimport({ includePaths: ['../../node_modules'] }))
    .pipe(concat('styles.css'))
    .pipe(prettier.format())
    .pipe(gulp.dest('./dist/'))
);

gulp.task('copy', () => {
  gulp
    .src('./src/**/*.scss')
    .pipe(cssimport({ includePaths: ['../../node_modules'] }))
    .pipe(concat('styles.scss'))
    .pipe(prettier.format())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('sass:watch', () => gulp.watch('./src/**/*.scss', ['sass']));

gulp.task('build', ['sass', 'copy']);

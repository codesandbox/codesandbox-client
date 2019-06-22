const gulp = require('gulp');
const _rimraf = require('rimraf');

function rimraf(dir) {
  let retries = 0;

  const retry = cb => {
    _rimraf(dir, { maxBusyTries: 1 }, err => {
      if (!err) {
        return cb();
      }

      if (err.code === 'ENOTEMPTY' && ++retries < 5) {
        return setTimeout(() => retry(cb), 10);
      }

      return cb(err);
    });
  };

  return cb => retry(cb);
}

gulp.task('clean-vscode', rimraf('standalone-packages/monaco-editor-core'));

gulp.task('prepare-vscode', ['clean-vscode'], () =>
  gulp
    .src('standalone-packages/vscode/out-monaco-editor-core/**/*')
    .pipe(gulp.dest('standalone-packages/monaco-editor-core'))
);

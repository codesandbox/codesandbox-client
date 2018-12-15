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

gulp.task('app', () =>
  gulp.src('packages/app/www/**/*').pipe(gulp.dest('www'))
);

gulp.task('homepage', () =>
  gulp.src('packages/homepage/public/**/*').pipe(gulp.dest('www'))
);

gulp.task('monaco', () =>
  gulp
    .src('standalone-packages/monaco-editor/release/min/vs/**/*')
    .pipe(gulp.dest('www/public/13/vs'))
);

// Used for cases where HTML is cached
gulp.task('old-browserfs', () =>
  gulp
    .src('standalone-packages/codesandbox-browserfs/dist/**/*')
    .pipe(gulp.dest('www/static/browserfs'))
);

gulp.task('old-vscode', () =>
  gulp
    .src('standalone-packages/vscode-editor/release/min/vs/**/*')
    .pipe(gulp.dest('public/vscode8/vs'))
);

gulp.task('statics', () =>
  gulp.src('packages/app/public/**/*').pipe(gulp.dest('www'))
);

gulp.task('default', [
  'app',
  'homepage',
  'statics',
  'monaco',
  'old-browserfs',
  'old-vscode',
]);

gulp.task('clean-vscode', rimraf('standalone-packages/monaco-editor-core'));

gulp.task('prepare-vscode', ['clean-vscode'], () =>
  gulp
    .src('standalone-packages/vscode/out-monaco-editor-core/**/*')
    .pipe(gulp.dest('standalone-packages/monaco-editor-core'))
);

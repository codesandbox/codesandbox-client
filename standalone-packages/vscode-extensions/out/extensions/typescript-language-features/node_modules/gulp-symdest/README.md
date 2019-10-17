# gulp-symdest

Like gulp.dest, but handles symlinks.

## Details

It assumes that if a [vinyl](https://github.com/wearefractal/vinyl) file
has a field `symlink`, then it is a `string` with the value for the
symlink itself.

## Usage

```javascript
var gulp = require('gulp');
var symdest = require('gulp-symdest');

gulp.task('default', function () {
	return gulp.src('path_with_symlinks/**')
		.pipe(symdest('out'));
});
```

# gulp-chmod [![Build Status](https://travis-ci.org/sindresorhus/gulp-chmod.svg?branch=master)](https://travis-ci.org/sindresorhus/gulp-chmod)

> [Change permissions](https://en.wikipedia.org/wiki/Chmod) of [Vinyl](https://github.com/gulpjs/vinyl) files


## Install

```
$ npm install --save-dev gulp-chmod
```


## Usage

```js
const gulp = require('gulp');
const chmod = require('gulp-chmod');

gulp.task('default', () =>
	gulp.src('src/app.js')
		.pipe(chmod(0o755))
		.pipe(gulp.dest('dist'))
);
```

or

```js
const gulp = require('gulp');
const chmod = require('gulp-chmod');

gulp.task('default', () =>
	gulp.src('src/app.js')
		.pipe(chmod({
			owner: {
				read: true,
				write: true,
				execute: true
			},
			group: {
				execute: true
			},
			others: {
				execute: true
			}
		}))
		.pipe(gulp.dest('dist'))
);
```


## API

### chmod(mode, [dirMode])

#### mode

Type: `number` `Object`

Can either be a [chmod](http://ss64.com/bash/chmod.html) octal number or an object with the individual permissions specified.

Values depends on the current file, but these are the possible keys:

```js
{
	owner: {
		read: true,
		write: true,
		execute: true
	},
	group: {
		read: true,
		write: true,
		execute: true
	},
	others: {
		read: true,
		write: true,
		execute: true
	}
}
```

When `read`, `write`, and `execute` are same, you can simplify the object:

```js
{
	read: true
}
```

Pass `null` to not set permissions on files. Useful if you only want to set permissions on directories.

#### dirMode

Type: `true` `number` `Object`

Same as `mode`, but applies to directories. Specify `true` to use the same value as `mode`.


## Tip

Combine it with [gulp-filter](https://github.com/sindresorhus/gulp-filter) to only change permissions on a subset of the files.

```js
const gulp = require('gulp');
const gFilter = require('gulp-filter');
const chmod = require('gulp-chmod');

const filter = gFilter('src/cli.js', {restore: true});

gulp.task('default', () =>
	gulp.src('src/*.js')
		// filter a subset of the files
		.pipe(filter)
		// make them executable
		.pipe(chmod(0o755))
		// bring back the previously filtered out files
		.pipe(filter.restore)
		.pipe(gulp.dest('dist'))
);
```


## Related

- [gulp-chown](https://github.com/sindresorhus/gulp-chown) - Change owner of Vinyl files


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)

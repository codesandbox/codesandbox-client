# gulp-vinyl-zip

[![Build Status](https://travis-ci.org/joaomoreno/gulp-vinyl-zip.svg?branch=master)](https://travis-ci.org/joaomoreno/gulp-vinyl-zip)

A library for creating and extracting ZIP archives from/to streams.

Uses [yazl](https://github.com/thejoshwolfe/yazl)
and [yauzl](https://github.com/thejoshwolfe/yauzl).

## Usage

**Archive → Archive**

```javascript
var gulp = require('gulp');
var zip = require('gulp-vinyl-zip');

gulp.task('default', function () {
	return zip.src('src.zip')
		.pipe(/* knock yourself out */)
		.pipe(zip.dest('out.zip'));
});
```

or

```javascript
var gulp = require('gulp');
var zip = require('gulp-vinyl-zip');

gulp.task('default', function () {
	return gulp.src('src.zip')
		.pipe(zip.src())
		.pipe(/* knock yourself out */)
		.pipe(zip.dest('out.zip'));
});
```

**Archive → File System**

```javascript
var gulp = require('gulp');
var zip = require('gulp-vinyl-zip');

gulp.task('default', function () {
	return zip.src('src.zip')
		.pipe(/* knock yourself out */)
		.pipe(gulp.dest('out'));
});
```

**File System → Archive**

```javascript
var gulp = require('gulp');
var zip = require('gulp-vinyl-zip');

gulp.task('default', function () {
	return gulp.src('src/**/*')
		.pipe(/* knock yourself out */)
		.pipe(zip.dest('out.zip'));
});
```

**File System → Archive Stream → Disk**

```javascript
var gulp = require('gulp');
var zip = require('gulp-vinyl-zip').zip; // zip transform only

gulp.task('default', function () {
	return gulp.src('src/**/*')
		.pipe(/* knock yourself out */)
		.pipe(zip('out.zip'))
		.pipe(/* knock your zip out */)
		.pipe(gulp.dest('./'));
});
```

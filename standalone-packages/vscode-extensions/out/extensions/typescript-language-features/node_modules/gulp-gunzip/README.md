# gulp-gunzip

[![NPM version](https://badge.fury.io/js/gulp-gunzip.svg)](http://badge.fury.io/js/gulp-gunzip)
[![Build Status](https://travis-ci.org/jmerrifield/gulp-gunzip.svg?branch=master)](https://travis-ci.org/jmerrifield/gulp-gunzip)

Uncompress gzip files in your [gulp](http://gulpjs.com) build pipeline

## Install

```bash
$ npm install --save-dev gulp-gunzip
```

## Usage

```js
var gulp = require('gulp')
var gunzip = require('gulp-gunzip')

gulp.task('uncompress', function () {
  return gulp.src('./compressed/*.gz')
    .pipe(gunzip())
    .pipe(gulp.dest('./uncompressed'))
})
```

In combination with [gulp-untar](https://github.com/jmerrifield/gulp-untar) and
[vinyl-source-stream](https://github.com/hughsk/vinyl-source-stream):

```js
var gulp = require('gulp')
var request = require('request')
var source = require('vinyl-source-stream')
var gunzip = require('gulp-gunzip')
var untar = require('gulp-untar')

gulp.task('default', function () {
  return request('http://example.org/some-file.tar.gz')
  .pipe(source('some-file.tar.gz'))
  .pipe(gunzip())
  .pipe(untar())
  .pipe(gulp.dest('output'))
})
```

## License

[MIT](http://opensource.org/licenses/MIT)

© [Jon Merrifield](http://www.jmerrifield.com)

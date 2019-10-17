# gulp-remote-src

[![Build Status](https://travis-ci.org/ddliu/gulp-remote-src.png)](https://travis-ci.org/ddliu/gulp-remote-src)

Remote `gulp.src`.

## Installation

Install package with NPM and add it to your development dependencies:

    npm install --save-dev gulp-remote-src

## Usage

```js
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var remoteSrc = require('gulp-remote-src');

gulp.task('remote', function() {
    
remoteSrc(['app.js', 'jquery.js'], {
        base: 'http://myapps.com/assets/'
    })
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
})
```

## Options

- `base`

    Url base.

    If you want to use absolute urls instead of relative ones, set this to
    `null`. When not configured, `/` is assumed.

- `buffer` (default is true)

    Pipe out files as buffer or as stream. Note that some plugins do not support streaming.

- `requestOptions`

    Options to be passed to [request](https://github.com/mikeal/request)

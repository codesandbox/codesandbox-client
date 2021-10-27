# vinyl-source-stream [![Flattr this!](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=hughskennedy&url=http://github.com/hughsk/vinyl-source-stream&title=vinyl-source-stream&description=hughsk/vinyl-source-stream%20on%20GitHub&language=en_GB&tags=flattr,github,javascript&category=software)[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges) #

Use conventional text streams at the start of your
[gulp](http://github.com/gulpjs/gulp) or
[vinyl](http://github.com/wearefractal/vinyl) pipelines, making for nicer
interoperability with the existing npm stream ecosystem.

Take, for example, [browserify](http://browserify.org/). There are the
[gulp-browserify](https://github.com/deepak1556/gulp-browserify) and
[gulpify](https://github.com/hughsk/gulpify) plugins, which you can use in
combination with gulp to get browserify working in your build. Unfortunately,
these plugins come with additional overhead: an extra GitHub repository, npm
module, maintainer, tests, semantics, etc. It's much simpler
in this case to use the original module directly where you can, which is what
`vinyl-source-stream` handles for you.

## Usage ##

[![vinyl-source-stream](https://nodei.co/npm/vinyl-source-stream.png?mini=true)](https://nodei.co/npm/vinyl-source-stream)

Our previous example, browserify, has a streaming API for its output bundles
which you can use directly. This module is just a bridge that makes it
simple to use conventional text streams such as this in combination with gulp.
Here's an example of using `vinyl-source-stream` and `browserify`, compared to
using `gulpify`:

``` javascript
var source = require('vinyl-source-stream')
var streamify = require('gulp-streamify')
var browserify = require('browserify')
var uglify = require('gulp-uglify')
var gulpify = require('gulpify')
var rename = require('gulp-rename')
var gulp = require('gulp')

// using gulpify:
gulp.task('gulpify', function() {
  gulp.src('index.js')
    .pipe(gulpify())
    .pipe(uglify())
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('./'))
})

// using vinyl-source-stream:
gulp.task('browserify', function() {
  var bundleStream = browserify('./index.js').bundle()

  bundleStream
    .pipe(source('index.js'))
    .pipe(streamify(uglify()))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('./'))
})
```

Not all that different, really! The nice thing here is that you're getting the
up-to-date browserify API and don't have to worry about the plugin's available
functionality. Of course, these same benefits apply for any readable text
stream you can find on npm.

## API ##

### `stream = sourceStream([filename])` ###

Creates a through stream which takes text as input, and emits a single
vinyl file instance for streams down the pipeline to consume.

`filename` is a "pretend" filename to use for your file, which some streams
might use to determine various factors such as the final filename of your file.
It should be a string, and though recommended, using this argument is optional.

## License ##

MIT. See [LICENSE.md](http://github.com/hughsk/vinyl-source-stream/blob/master/LICENSE.md) for details.

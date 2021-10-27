var through = require('through2')
var parse = require('tar').Parse
var gutil = require('gulp-util')
var path = require('path')
var streamifier = require('streamifier')
var es = require('event-stream')

module.exports = function () {
  return through.obj(function (file, enc, callback) {
    var contentsStream

    if (file.isNull()) {
      return this.push(file)
    }

    if (file.isStream()) {
      contentsStream = file.contents
    }

    if (file.isBuffer()) {
      contentsStream = streamifier.createReadStream(file.contents)
    }

    contentsStream
    .pipe(parse())
    .on('entry', function (entry) {
      if (entry.props.type !== '0') return

      // Accumulate the contents and emit a file with a Buffer of the contents.
      //
      // I tried returning the entry as the contents of each file but that
      // seemed unreliable, presumably each entry stream is intended to be
      // consumed *as we read* the source archive, so handing out individual
      // streams to consumers means that we're depending on them consuming
      // each stream in sequence.

      entry.pipe(es.wait(function (err, data) {
        if (err) return this.emit('error', err)

        this.push(new gutil.File({
          contents: new Buffer(data),
          path: path.normalize(path.dirname(file.path) + '/' + entry.props.path),
          base: file.base,
          cwd: file.cwd
        }))
      }.bind(this)))
    }.bind(this))
    .on('end', function () {
      callback()
    })
  })
}

var through = require('through2')
var File = require('vinyl');
var zlib = require('zlib')

module.exports = function () {
  return through.obj(function (file, enc, callback) {
    if (file.isNull()) {
      this.push(file)
      return callback()
    }

    var path = file.path.replace(/\.gz$/, '')

    if (file.isStream()) {
      this.push(new File({
        base: file.base,
        path: path,
        contents: file.contents.pipe(zlib.createGunzip())
      }))

      callback()
    }

    if (file.isBuffer()) {
      zlib.gunzip(file.contents, function (err, buffer) {
        if (err) return this.emit('error', err)

        this.push(new File({
          base: file.base,
          path: path,
          contents: buffer
        }))

        callback()
      }.bind(this))
    }
  })
}
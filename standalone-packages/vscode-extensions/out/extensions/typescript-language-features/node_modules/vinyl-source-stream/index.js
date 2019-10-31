var through2 = require('through2')
var File = require('vinyl')
var path = require('path')

module.exports = function (filename, baseDir) {
  var ins = through2()
  var out = false

  var opts = {
    contents: ins
  }

  if (filename) opts.path = path.resolve(baseDir || process.cwd(), filename)
  if (baseDir) opts.base = baseDir

  var file = new File(opts)

  return through2({
    objectMode: true
  }, function(chunk, enc, next) {
    if (!out) {
      this.push(file)
      out = true
    }

    ins.push(chunk)
    next()
  }, function() {
    ins.push(null)
    this.push(null)
  })
}

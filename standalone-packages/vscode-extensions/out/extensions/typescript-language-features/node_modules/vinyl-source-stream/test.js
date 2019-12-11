var rename = require('gulp-rename')
var map = require('vinyl-map')
var srcStream = require('./')
var gulp = require('gulp')
var test = require('tape')
var path = require('path')
var fs = require('fs')

test('capitalizing test file', function(t) {
  fs.createReadStream(__filename)
    .pipe(srcStream(__filename))
    .pipe(map(function(str) {
      return str.toString().toUpperCase()
    }))
    .pipe(rename("fixture.js"))
    .pipe(gulp.dest('.'))
    .once('end', function() {
      // gulp.dest finishes before writing
      // the file is complete...
      setTimeout(function() {
        t.pass('reached pipline "end" event')
        t.equal(
            fs.readFileSync(__dirname + '/fixture.js', 'utf8')
          , fs.readFileSync(__filename, 'utf8').toUpperCase()
          , 'transformed contents as expected'
        )

        fs.unlink(__dirname + '/fixture.js', function(err) {
          t.ifError(err, 'removed fixture successfully')
          t.end()
        })
      }, 1500)
    })
})

test('baseDir: defaults to process.cwd()', function(t) {
  process.chdir(path.resolve(__dirname, '..', '..'))

  fs.createReadStream(__filename)
    .pipe(srcStream(path.basename(__filename)))
    .on('data', function(file) {
      t.equal(process.cwd(), path.dirname(file.path), 'defaults to process.cwd()')

      process.chdir(__dirname)

      t.end()
    })
})

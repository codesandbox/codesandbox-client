var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var vfs = require('vinyl-fs');
var es = require('event-stream');
var queue = require('queue');

function createSymlink(dest, symlink, cb) {
	mkdirp(path.dirname(dest), function (err) {
		if (err) { return cb(err); }

		fs.symlink(symlink, dest, cb);
	});
}

module.exports = function (out) {
	var pass = es.through();
	var symlinks = [];

	return es.duplex(pass,
		pass.pipe(es.mapSync(function (f) {
			if (!f.symlink) {
				return f;
			}
			
			symlinks.push(f);
		}))
		.pipe(vfs.dest(out))
		.pipe(es.through(null, function () {
			var q = queue();
			q.concurrency = 1;
			q.timeout = 1000;

			var that = this;
			symlinks.forEach(function (f) {
				q.push(function (cb) {
					createSymlink(path.join(out, f.relative), f.symlink, cb);
				});
			});

			q.start(function (err) {
				if (err) {
					that.emit('error', err);
				} else {
					that.emit('end');
				}
			});
		}))
	);
};
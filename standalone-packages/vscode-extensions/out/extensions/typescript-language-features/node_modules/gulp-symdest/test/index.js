var assert = require('assert');
var symdest = require('..');
var File = require('vinyl');
var es = require('event-stream');
var tmp = require('tmp');
var fs = require('fs');
tmp.setGracefulCleanup();

describe('gulp-symdest', function () {
	it('should work', function (cb) {
		var file = new File({ path: 'hello.md' });
		file.symlink = 'world.md';
		var instream = es.readArray([file]);
		
		var out = tmp.dirSync().name;
		
		instream
			.pipe(symdest(out))
			.pipe(es.through(null, function () {
				assert.deepEqual(fs.readdirSync(out), ['hello.md']);
				assert.throws(function () { fs.statSync(out + '/hello.md'); });
				var stat = fs.lstatSync(out + '/hello.md');
				assert(stat.isSymbolicLink());
				
				cb();
			}));
	});
});
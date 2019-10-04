var remoteSrc = require('./');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');

var FILES = [
    "src/node.js",
    "lib/_debugger.js",
    "lib/_linklist.js",
    "lib/_stream_duplex.js",
    "lib/_stream_passthrough.js",
    "lib/_stream_readable.js",
    "lib/_stream_transform.js",
    "lib/_stream_writable.js",
    "lib/assert.js",
    "lib/buffer.js",
    "lib/child_process.js",
    "lib/cluster.js",
    "lib/console.js",
    "lib/constants.js",
    "lib/crypto.js",
    "lib/dgram.js",
    "lib/dns.js",
    "lib/domain.js",
    "lib/events.js",
    "lib/freelist.js",
    "lib/fs.js",
    "lib/http.js",
    "lib/https.js",
    "lib/module.js",
    "lib/net.js",
    "lib/os.js",
    "lib/path.js",
    "lib/punycode.js",
    "lib/querystring.js",
    "lib/readline.js",
    "lib/repl.js",
    "lib/stream.js",
    "lib/string_decoder.js",
    "lib/sys.js",
    "lib/timers.js",
    "lib/tls.js",
    "lib/tty.js",
    "lib/url.js",
    "lib/util.js",
    "lib/vm.js",
    "lib/zlib.js"
];

var URL = "https://raw.githubusercontent.com/joyent/node/v0.10.29/"

gulp.task('clean', function() {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('nostream', ['clean'], function() {
    return remoteSrc(FILES, {
            base: URL
        })
        .pipe(uglify())
        .pipe(gulp.dest('dist/nostream'));
});

gulp.task('stream', ['clean'], function() {
    return remoteSrc(FILES, {
            buffer: false,
            base: URL
        })
        .pipe(gulp.dest('dist/stream'));
});

gulp.task('self-signed-ssl', ['clean'], function() {
    return remoteSrc(['index.html'], {
            strictSSL: false,
            base: 'https://example.com/'
        })
        .pipe(gulp.dest('dist/strictSSL'));
});

// run this task alone to test timeout
gulp.task('timeout', ['clean'], function() {
    return remoteSrc(FILES, {
        base: URL,
        timeout: 1
    })
    .pipe(gulp.dest('dist/timeout'));
});

gulp.task('test', ['stream', 'nostream', 'self-signed-ssl']);
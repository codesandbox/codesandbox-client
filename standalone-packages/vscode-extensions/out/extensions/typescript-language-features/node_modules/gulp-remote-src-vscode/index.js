var util = require('util');
var es = require('event-stream');
var request = require('request');
var File = require('vinyl');
var through2 = require('through2');
var extend = require('node.extend');

module.exports = function (urls, options) {
    if (options === undefined) {
        options = {};
    }

    if (typeof options.base !== 'string' && options.base !== null) {
        options.base = '/';
    }

    if (typeof options.buffer !== 'boolean') {
        options.buffer = true;
    }

    if (!util.isArray(urls)) {
        urls = [urls];
    }

    var allowedRequestOptions = ['qs', 'headers', 'auth', 'followRedirect', 'followAllRedirects', 'maxRedirects', 'timeout', 'proxy',
        'strictSSL', 'aws', 'gzip'];

    var requestBaseOptions = {};
    for (var i = allowedRequestOptions.length - 1; i >= 0; i--) {
        var k = allowedRequestOptions[i];
        if (k in options) {
            requestBaseOptions[k] = options[k];
        }
    }

    if (options.requestOptions) {
        for (var k in options.requestOptions) {
            requestBaseOptions[k] = options.requestOptions[k];
        }
    }

    return es.readArray(urls).pipe(es.map(function(data, cb) {
        var url = [options.base, data].join(''), requestOptions = extend({url: url}, requestBaseOptions);

        if (!options.buffer) {
            var file = new File({
                cwd: '/',
                base: options.base,
                path: url,
                // request must be piped out once created, or we'll get this error: "You cannot pipe after data has been emitted from the response."
                contents: request(requestOptions).pipe(through2())
            });

            cb(null, file);
        } else {
            // set encoding to `null` to return the body as buffer
            requestOptions.encoding = null;

            request(requestOptions, function (error, response, body) {
                if (!error && (response.statusCode >= 200 && response.statusCode < 300)) {
                    var file = new File({
                        cwd: '/',
                        base: options.base,
                        path: url,
                        contents: body
                    });
                    cb(null, file);
                } else {
                    if (!error) {
                        error = new Error('Request ' + url + ' failed with status code:' + response.statusCode);
                    }
                    cb(error);
                }
            });
        }
    }));
};

// encode-stream.js

exports.createEncodeStream = EncodeStream;

var util = require("util");
var Transform = require("stream").Transform;
var EncodeBuffer = require("./encode-buffer").EncodeBuffer;

util.inherits(EncodeStream, Transform);

var DEFAULT_OPTIONS = {objectMode: true};

function EncodeStream(options) {
  if (!(this instanceof EncodeStream)) return new EncodeStream(options);
  if (options) {
    options.objectMode = true;
  } else {
    options = DEFAULT_OPTIONS;
  }
  Transform.call(this, options);

  var stream = this;
  var encoder = this.encoder = new EncodeBuffer(options);
  encoder.push = function(chunk) {
    stream.push(chunk);
  };
}

EncodeStream.prototype._transform = function(chunk, encoding, callback) {
  this.encoder.write(chunk);
  if (callback) callback();
};

EncodeStream.prototype._flush = function(callback) {
  this.encoder.flush();
  if (callback) callback();
};

// msgpack.js

exports.encode = require("./lib/encode").encode;
exports.decode = require("./lib/decode").decode;

exports.Encoder = require("./lib/encoder").Encoder;
exports.Decoder = require("./lib/decoder").Decoder;

exports.createEncodeStream = require("./lib/encode-stream").createEncodeStream;
exports.createDecodeStream = require("./lib/decode-stream").createDecodeStream;

exports.createCodec = require("./lib/ext").createCodec;
exports.codec = require("./lib/codec").codec;

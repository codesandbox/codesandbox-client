"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
class DevNull extends stream_1.Duplex {
    _read() { }
    _write(chunk, enc, cb) {
        cb();
    }
}
exports.DevNull = DevNull;

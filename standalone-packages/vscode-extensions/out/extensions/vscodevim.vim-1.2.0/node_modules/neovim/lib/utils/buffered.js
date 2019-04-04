"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const MIN_SIZE = 8 * 1024;
class Buffered extends stream_1.Transform {
    constructor() {
        super({
            readableHighWaterMark: 10 * 1024 * 1024,
            writableHighWaterMark: 10 * 1024 * 1024,
        });
        this.chunks = null;
        this.timer = null;
    }
    sendData() {
        const { chunks } = this;
        if (chunks) {
            this.chunks = null;
            const buf = Buffer.concat(chunks);
            this.push(buf);
        }
    }
    // eslint-disable-next-line consistent-return
    _transform(chunk, encoding, callback) {
        const { chunks, timer } = this;
        if (timer)
            clearTimeout(timer);
        if (chunk.length < MIN_SIZE) {
            if (!chunks)
                return callback(null, chunk);
            chunks.push(chunk);
            this.sendData();
            callback();
        }
        else {
            if (!chunks) {
                this.chunks = [chunk];
            }
            else {
                chunks.push(chunk);
            }
            this.timer = setTimeout(this.sendData.bind(this), 20);
            callback();
        }
    }
    _flush(callback) {
        const { chunks } = this;
        if (chunks) {
            this.chunks = null;
            const buf = Buffer.concat(chunks);
            callback(null, buf);
        }
        else {
            callback();
        }
    }
}
exports.default = Buffered;

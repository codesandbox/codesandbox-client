"use strict";
const child_process_1 = require('child_process');
function exec(exec_path, args, input) {
    const fmt = child_process_1.spawn(exec_path, args);
    const chunks = [];
    fmt.stdout.on('data', (data) => {
        chunks.push(data.toString());
    });
    const err_chunks = [];
    fmt.stderr.on('data', (data) => {
        err_chunks.push(data.toString());
    });
    fmt.stdin.setDefaultEncoding('utf-8');
    fmt.stdin.write(input);
    fmt.stdin.end();
    return new Promise((resolve, reject) => {
        fmt.on('exit', (code) => {
            if (code === 0 && err_chunks.length === 0) {
                resolve(chunks.join(""));
            }
            else {
                reject(err_chunks.join(''));
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exec;
//# sourceMappingURL=exec.js.map
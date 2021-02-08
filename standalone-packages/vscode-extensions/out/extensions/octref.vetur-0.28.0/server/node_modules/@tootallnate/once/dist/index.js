"use strict";
function once(emitter, name) {
    let c = null;
    const p = new Promise((resolve, reject) => {
        function cancel() {
            emitter.removeListener(name, onEvent);
            emitter.removeListener('error', onError);
        }
        function onEvent(arg) {
            cancel();
            resolve(arg);
        }
        function onError(err) {
            cancel();
            reject(err);
        }
        c = cancel;
        emitter.on(name, onEvent);
        emitter.on('error', onError);
    });
    if (!c) {
        throw new TypeError('Could not get `cancel()` function');
    }
    p.cancel = c;
    return p;
}
module.exports = once;
//# sourceMappingURL=index.js.map
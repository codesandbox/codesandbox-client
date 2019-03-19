'use strict';

const util = require('util');
const EventEmitter = require('events').EventEmitter;

const Session = require('msgpack5rpc');
const _ = require('lodash');
const traverse = require('traverse');

const RE_VERSION = /^\n*NVIM v?(\d+)\.(\d+)\.(\d+)(.*)\s*\n/;

function Nvim(session, channel_id) {
    this._session = session;
    this._decode = decode;
    this._channel_id = channel_id;
}
util.inherits(Nvim, EventEmitter);

function decode(obj) {
    traverse(obj).forEach(function(item) {
        if (item instanceof Session) {
            this.update(item, true);
        } else if (Buffer.isBuffer(item)) {
            try { this.update(item.toString('utf8')); } catch (e) { /* Ignore */ }
        }
    });

    return obj;
}

function equals(other) {
    try {
        return this._data.toString() === other._data.toString();
    } catch (e) {
        return false;
    }
}

function quit() {
    this.command('qa!', true);
}

function getVersion() {
    return this.commandOutput('silent version').then(out => {
        const m = out.match(RE_VERSION);
        if (m === null) {
            throw new Error(
                `Unexpected output format from :version command: '${out}'`
            );
        }

        return {
            major: parseInt(m[1], 10),
            minor: parseInt(m[2], 10),
            patch: parseInt(m[3], 10),
            rest: m[4]
        };
    });
}

function generateWrappers(Nvim, types, metadata) {
    for (let i = 0; i < metadata.functions.length; i++) {
        const func = metadata.functions[i];
        const parts = func.name.split('_');
        const typeName = _.capitalize(parts[0]);
        if (typeName === 'Vim') {
            // Skip APIs prefixed with 'vim_' because they exist for compatibility reason.
            continue;
        }
        // The type name is the word before the first dash capitalized. If the type
        // is Vim, then it a editor-global method which will be attached to the Nvim
        // class.
        const methodName = _.camelCase(
            (typeName === 'Ui' ? parts : parts.slice(1)).join('_')
        );
        let args = func.parameters.map(p => p[1]);
        let Type, callArgs;
        if (typeName === 'Nvim' || typeName === 'Ui') {
            Type = Nvim;
            callArgs = args.join(', ');
        } else {
            Type = types[typeName];
            args = args.slice(1);
            // This is a method of one of the ext types, prepend "this" to the call
            // arguments.
            callArgs = ['this'].concat(args).join(', ');
        }
        args.push('notify');
        const params = args.join(', ');
        // XXX:
        // Using string constructor because `notify` argument can't be distinguished
        // if `...args` or `arguments` used.  They need if using anonymous function.
        const method = new Function(`
                return function ${methodName}(${params}) {
                  if (notify) {
                    this._session.notify("${func.name}", [${callArgs}]);
                    return;
                  }
                  return new Promise((resolve, reject) => {
                    this._session.request("${func.name}", [${callArgs}], (err, res) => {
                     if (err) return reject(new Error(err[1]));
                     resolve(this._decode(res));
                   });
                  });
                };
            `)();
        const paramTypes = func.parameters.map(p => p[0]);
        paramTypes.push('Boolean');
        method.metadata = {
            name: methodName,
            deferred: func.deferred,
            returnType: func.return_type,
            parameters: args,
            parameterTypes: paramTypes,
            canFail: func.can_fail
        };
        if (typeName !== 'Nvim' && typeName !== 'Ui') {
            method.metadata.parameterTypes.shift();
        }
        Type.prototype[methodName] = method;
    }
}

// Note: Use callback because it may be called more than once.
module.exports.attach = function attach(writer, reader) {
    let session = new Session([]);
    let nvim = new Nvim(session);
    const initSession = session;
    const pendingRPCs = [];

    session.attach(writer, reader);

    return new Promise(function(resolve, reject){
        // register initial RPC handlers to queue non-specs requests until api is generated
        session.on('request', function(method, args, resp) {
            if (method !== 'specs') {
                pendingRPCs.push({
                    type: 'request',
                    args: Array.prototype.slice.call(arguments)
                });
            } else {
                resolve(nvim); // the errback may be called later, but 'specs' must be handled
                nvim.emit('request', decode(method), decode(args), resp);
            }
        });

        session.on('notification', function() {
            pendingRPCs.push({
                type: 'notification',
                args: Array.prototype.slice.call( arguments )
            });
        });

        session.on('detach', function() {
            session.removeAllListeners('request');
            session.removeAllListeners('notification');
            nvim.emit('disconnect');
        });

        session.request('nvim_get_api_info', [], function(err, res) {
            if (err) {
                const msg = `Error at initialization: nvim_get_api_info: ${err[1]}: If you're using nvim v0.1.5 or earlier, please update nvim.`;
                return reject(new Error(msg));
            }

            const channel_id = res[0];

            const metadata = decode(res[1]);
            const extTypes = [];
            const types = {};

            Object.keys(metadata.types).forEach(function(name) {
                // Generate a constructor function for each type in metadata.types
                const Type = function(session, data, decode) {
                    this._session = session;
                    this._data = data;
                    this._decode = decode;
                };
                Object.defineProperty(Type, 'name', {value: name});
                Type.prototype.equals = equals;

                // Collect the type information necessary for msgpack5 deserialization
                // when it encounters the corresponding ext code.
                extTypes.push({
                    constructor: Type,
                    code: metadata.types[name].id,
                    decode: function(data) { return new Type(session, data, decode); },
                    encode: function(obj) { return obj._data; }
                });

                types[name] = Type;
                Nvim.prototype[name] = Type;
            });

            generateWrappers(Nvim, types, metadata);
            Nvim.prototype.quit = quit;
            Nvim.prototype.getVersion = getVersion;

            session = new Session(extTypes);
            session.attach(writer, reader);

            nvim = new Nvim(session, channel_id);

            // register the non-queueing handlers
            session.on('request', function(method, args, resp) {
                nvim.emit('request', decode(method), decode(args), resp);
            });

            session.on('notification', function(method, args) {
                nvim.emit('notification', decode(method), decode(args));
            });

            session.on('detach', function() {
                session.removeAllListeners('request');
                session.removeAllListeners('notification');
                nvim.emit('disconnect');
            });

            resolve(nvim);

            // dequeue any pending RPCs
            initSession.detach();
            pendingRPCs.forEach(function(pending) {
                if(pending.type === 'request') {
                    // there's no clean way to change the output channel using the current
                    // Session abstraction
                    pending.args[pending.args.length - 1]._encoder = session._encoder;
                }
                nvim.emit.apply(nvim, [].concat(pending.type, pending.args));
            });
        });
    });
};

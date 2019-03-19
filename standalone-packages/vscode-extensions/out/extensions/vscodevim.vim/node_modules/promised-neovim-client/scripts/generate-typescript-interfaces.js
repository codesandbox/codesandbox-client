var cp = require('child_process');

var attach = require('../index').attach;

var proc = cp.spawn('nvim', ['-u', 'NONE', '-N', '--embed'], {
    cwd: __dirname
});

var typeMap = {
    'String': 'string',
    'Integer': 'number',
    'Boolean': 'boolean',
    'Array': 'Array<RPCValue>',
    'Dictionary': '{[key: string]: RPCValue}',
    'Object': 'VimValue',
};

function convertType(type) {
    if (typeMap[type]) return typeMap[type];
    var genericMatch = /Of\((\w+)[^)]*\)/.exec(type);
    if (genericMatch) {
        var t = convertType(genericMatch[1]);
        if (/^Array/.test(type)) {
            return 'Array<' + t + '>';
        } else {
            return '{ [key: string]: ' + t + '; }';
        }
    }
    return type;
}

function metadataToSignature(method) {
    var params = [];
    for (var i = 0; i < method.parameters.length; i++) {
        var name = method.parameters[i];
        if (name === 'notify') {
            name += '?';
        }
        params.push(name + ': ' + convertType(method.parameterTypes[i]));
    }
    return '  ' + method.name + '(' + params.join(', ') + '): Promise<' + convertType(method.returnType) + '>;\n';
}

attach(proc.stdin, proc.stdout).then(function(nvim) {
    var interfaces = {
        Nvim: nvim.constructor,
        Buffer: nvim.Buffer,
        Window: nvim.Window,
        Tabpage: nvim.Tabpage,
    };

    // use a similar reference path to other definitely typed declarations
    Object.keys(interfaces).forEach(function(key) {
        if (key === 'Nvim') {
            process.stdout.write('export interface ' + key + ' extends NodeJS.EventEmitter {\n');
            process.stdout.write('  quit(): void;\n');
            process.stdout.write('  getVersion(): NvimVersion;\n');
        } else {
            process.stdout.write('export interface ' + key + ' {\n');
        }
        Object.keys(interfaces[key].prototype).forEach(function(method) {
            method = interfaces[key].prototype[method];
            if (method.metadata) {
                process.stdout.write(metadataToSignature(method.metadata));
            }
        })
        process.stdout.write('  equals(rhs: ' + key + '): boolean;\n');
        process.stdout.write('}\n');
    });

    process.stdout.write('export function attach(writer: NodeJS.WritableStream, reader: NodeJS.ReadableStream): Promise<Nvim>;\n\n');
    process.stdout.write('export interface NvimVersion { major: number; minor: number; patch: number; rest: string; }\n');
    process.stdout.write('export type RPCValue = Buffer | Window | Tabpage | number | boolean | string | any[] | {[key: string]: any};\n');

    // Note:
    // When the result is funcref value, null is returned.
    process.stdout.write('export type VimValue = number | boolean | string | any[] | {[key: string]: any} | null');

    proc.stdin.end();
}).catch(function(err){ console.error(err); });

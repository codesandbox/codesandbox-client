const cp = require('child_process');
const attach = require('../src/attach');

const proc = cp.spawn('nvim', ['-u', 'NONE', '-N', '--embed'], {
  cwd: __dirname,
});

const typeMap = {
  String: 'string',
  Integer: 'number',
  Boolean: 'boolean',
  Array: 'Array<any>',
  Dictionary: '{}',
};

function convertType(type) {
  if (typeMap[type]) return typeMap[type];
  const genericMatch = /Of\((\w+)[^)]*\)/.exec(type);
  if (genericMatch) {
    const t = convertType(genericMatch[1]);
    if (/^Array/.test(type)) return `Array<${t}>`;
    return `{ [key: string]: ${t}; }`;
  }
  return type;
}

function metadataToSignature(method) {
  const params = [];
  method.parameters.forEach((param, i) => {
    let type;
    if (i < method.parameterTypes.length) {
      type = convertType(method.parameterTypes[i]);
    }
    params.push(`${method.parameters[i]}: ${type}`);
  });
  const rtype = convertType(method.returnType);
  // eslint-disable-next-line
  const returnTypeString = rtype === 'void' ? rtype : `Promise<${rtype}>`;
  return `  ${method.name}(${params.join(', ')}): ${returnTypeString};\n`;
}

async function main() {
  const nvim = await attach({ proc });
  const interfaces = {
    Neovim: nvim.constructor,
    Buffer: nvim.Buffer,
    Window: nvim.Window,
    Tabpage: nvim.Tabpage,
  };

  // use a similar reference path to other definitely typed declarations
  process.stdout.write('interface AttachOptions {\n');
  process.stdout.write('  writer?: NodeJS.WritableStream,\n');
  process.stdout.write('  reader?: NodeJS.ReadableStream,\n');
  process.stdout.write('  proc?: NodeJS.ChildProcess,\n');
  process.stdout.write('  socket?: String,\n');
  process.stdout.write('}\n');
  process.stdout.write(
    'export default function attach(options: AttachOptions): Neovim;\n\n'
  );

  Object.keys(interfaces).forEach(key => {
    let name = key;
    if (key === 'Neovim') {
      name += ' extends NodeJS.EventEmitter';
    }
    process.stdout.write(`export interface ${name} {\n`);
    if (key === 'Neovim') {
      process.stdout.write('  quit(): void;\n');
      process.stdout.write('  isApiReady(): Boolean;\n');
      process.stdout.write('  requestApi(): Promise<[integer, any]>;\n');
    }
    process.stdout.write(`  equals(rhs: ${key}): boolean;\n`);

    Object.keys(interfaces[key].prototype).forEach(methodName => {
      const method = interfaces[key].prototype[methodName];
      if (method.metadata) {
        process.stdout.write(metadataToSignature(method.metadata));
      }
    });
    process.stdout.write('}\n');
  });

  proc.stdin.end();
}

try {
  main();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
}

import { EventEmitter } from 'events';

// var rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//     terminal: false,
// });

interface IReadlineOptions {
  input: EventEmitter;
  output: EventEmitter;
}

export function createInterface(options: IReadlineOptions) {
  const emitter = new EventEmitter();

  options.input.on('data', data => {
    emitter.emit('line', data);
  });

  return emitter;
}

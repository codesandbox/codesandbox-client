const process = {};
process.title = 'browser';
process.browser = true;
process.env = { NODE_ENV: 'development' };
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function(name) {
  return [];
};

process.binding = function(name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function() {
  return '/';
};
process.chdir = function(dir) {
  throw new Error('process.chdir is not supported');
};
process.umask = function() {
  return 0;
};

export default function build() {
  return process;
}

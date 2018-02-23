// Appended before Emscripten output.
module.exports = function(Module) {

if (!Module) {
  Module = {};
}

Object.defineProperties(Module, {
  'FS': {
    get: function() {
      return FS;
    }
  },
  'IDBFS': {
    get: function() {
      return IDBFS;
    }
  },
  'PATH': {
    get: function() {
      return PATH;
    }
  },
  'ERRNO_CODES': {
    get: function() {
      return ERRNO_CODES;
    }
  }
});

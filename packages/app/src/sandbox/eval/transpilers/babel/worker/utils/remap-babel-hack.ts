export function remapBabelHack() {
  if (self.module.exports.availablePlugins) {
    // Okay, Babel thought it was in a commonjs env and now put everything on
    // self.exports. We need to remap it.

    // @ts-ignore
    self.Babel = self.module.exports;

    // Reset module for next time Babel loads
    // @ts-ignore
    self.module = { exports: {} };
    const { exports } = self.module;
    self.exports = exports;
  }
}

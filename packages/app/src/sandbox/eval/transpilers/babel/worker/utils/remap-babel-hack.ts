export function remapBabelHack() {
  if (self.exports.availablePlugins) {
    // Okay, Babel thought it was in a commonjs env and now put everything on
    // self.exports. We need to remap it.

    // @ts-ignore
    self.Babel = self.exports;
  }
}

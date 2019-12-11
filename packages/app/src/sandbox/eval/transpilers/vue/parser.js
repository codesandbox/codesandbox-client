/* eslint-disable */
const compiler = require('vue-template-compiler');
const cache = require('lru-cache')(100);
const hash = require('hash-sum');
const SourceMapGenerator = require('source-map').SourceMapGenerator;

const splitRE = /\r?\n/g;
const emptyRE = /^(?:\/\/)?\s*$/;

module.exports = function(content, filename, needMap, sourceRoot) {
  const cacheKey = hash(filename + content);
  // source-map cache busting for hot-reloadded modules
  const filenameWithHash = filename + '?' + cacheKey;
  let output = cache.get(cacheKey);
  if (output) return output;
  output = compiler.parseComponent(content, { pad: 'line' });
  if (needMap) {
    if (output.script && !output.script.src) {
      output.script.map = generateSourceMap(
        filenameWithHash,
        content,
        output.script.content,
        sourceRoot
      );
    }
    if (output.styles) {
      output.styles.forEach(style => {
        if (!style.src) {
          style.map = generateSourceMap(
            filenameWithHash,
            content,
            style.content,
            sourceRoot
          );
        }
      });
    }
  }
  cache.set(cacheKey, output);
  return output;
};

function generateSourceMap(filename, source, generated, sourceRoot) {
  const map = new SourceMapGenerator({ sourceRoot });
  map.setSourceContent(filename, source);
  generated.split(splitRE).forEach((line, index) => {
    if (!emptyRE.test(line)) {
      map.addMapping({
        source: filename,
        original: {
          line: index + 1,
          column: 0,
        },
        generated: {
          line: index + 1,
          column: 0,
        },
      });
    }
  });
  return map.toJSON();
}

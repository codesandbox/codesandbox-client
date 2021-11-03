const REQUIRE_LINE_RE = /require\s*\(\s*['|"|`]([^\s]*)['|"|`]\s*\)/g;
const REQUIRE_RE = /require\s*\(\s*['|"|`]([^\s]*)['|"|`]\s*\)/;
const COMMENT_RE = /^(\s*\/?\*)|(\/\/)/;

/**
 * This is the regex version of getting all require statements, it makes the assumption
 * that the file is commonjs and only has `require()` statements.
 */
export default function getRequireStatements(code: string) {
  const results = [];
  code.split('\n').forEach(line => {
    const commentMatch =
      line.indexOf('/*#__PURE__*/') === -1 && COMMENT_RE.exec(line);

    if (commentMatch && commentMatch.index === 0) {
      return;
    }

    if (line.includes('require("".concat')) {
      throw new Error('Glob require is part of statement');
    }

    const matches = line.match(REQUIRE_LINE_RE);

    if (matches) {
      matches.forEach(codePart => {
        const match = codePart.match(REQUIRE_RE);

        if (match) {
          if (commentMatch && line.indexOf(codePart) > commentMatch.index) {
            // It's in a comment
            return;
          }

          if (match[1]) {
            if (
              !results.find(r => r.type === 'direct' && r.path === match[1])
            ) {
              results.push({
                type: 'direct',
                path: match[1],
              });
            }
          } else if (match[2] && /'|"|`/.test(match[2])) {
            if (!results.find(r => r.type === 'glob' && r.path === match[2])) {
              results.push({
                type: 'glob',
                path: match[2],
              });
            }
          }
        }
      });
    }
  });

  return results;
}

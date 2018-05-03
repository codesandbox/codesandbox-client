/**
 * This is the regex version of getting all require statements, it makes the assumption
 * that the file is commonjs and only has `require()` statements.
 */
export default function getRequireStatements(code: string) {
  const results = [];
  code.split('\n').forEach(line => {
    const regex = /require\(['|"|`]([^"|'|`]*)['|"|`]\)|require\((.*)\)/;
    const match = line.match(regex);

    if (match) {
      if (match[1]) {
        if (!results.find(r => r.type === 'direct' && r.path === match[1])) {
          results.push({
            type: 'direct',
            path: match[1],
          });
        }
      } else if (match[2]) {
        if (!results.find(r => r.type === 'glob' && r.path === match[2])) {
          results.push({
            type: 'glob',
            path: match[2],
          });
        }
      }
    }
  });

  return results;
}

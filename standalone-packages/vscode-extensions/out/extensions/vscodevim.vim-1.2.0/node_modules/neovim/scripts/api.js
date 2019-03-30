/* eslint no-console:0  global-require:0 */
const search = process.argv[2] || '';

async function main() {
  const nvim = await require('./nvim');
  const results = await nvim.requestApi();
  const { functions } = results[1];
  const lines = functions.filter(({ name }) => name.indexOf(search) > -1);
  lines
    .filter(metadata => typeof metadata.deprecated_since === 'undefined')
    .forEach(metadata => {
      const params = metadata.parameters.map(p => p[1]);
      const paramTypes = metadata.parameters.map(p => p[0]);
      console.log(
        `${metadata.name}(${params
          .map((p, i) => `${p}: ${paramTypes[i]}`)
          .join(', ')}): ${metadata.return_type}`
      );
      console.log(`    method: ${metadata.method}`);
      console.log(`    since: ${metadata.since}`);
      console.log('');
    });
  process.exit(0);
}

try {
  main();
} catch (err) {
  console.error(err);
  process.exit(1);
}

const glob = require('glob');
const jsYaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

glob('syntaxes/*.yaml', { nocase: true }, (_, files) => {
  for (const file of files) {
    const pathData = path.parse(file);
    fs.writeFileSync(
      pathData.dir + '/' + pathData.name + '.tmLanguage.json',
      JSON.stringify(jsYaml.safeLoad(fs.readFileSync(file)), null, 2)
    );
  }
  console.log('built files', files);
});

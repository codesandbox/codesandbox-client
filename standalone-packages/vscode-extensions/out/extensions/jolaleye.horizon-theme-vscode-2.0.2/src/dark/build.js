const fs = require('fs');
const mustache = require('mustache');

const globals = require('./globals.json');
const template = JSON.stringify(require(`${__dirname}/template.json`));
const themeNames = ['horizon', 'horizon-italic', 'horizon-bold'];

for (themeName of themeNames) {
  const content = require(`${__dirname}/${themeName}.json`);
  const theme = mustache.render(template, { ...content, ...globals });
  fs.writeFileSync(`${__dirname}/../../themes/${themeName}.json`, theme);
}

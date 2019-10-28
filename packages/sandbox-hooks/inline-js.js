const fs = require('fs');

const html = fs.readFileSync('./dist/index.html');
const jsFile = fs.readdirSync('dist').find(s => s.endsWith('.js'));
const jsFileContents = fs.readFileSync('./dist/' + jsFile);

const newHTML = html
  .toString()
  .replace(/<script.*<\/script>/gm, '')
  .replace('</body>', `<script>${jsFileContents}</script></body>`);

fs.writeFileSync('./dist/index.html', newHTML);

// eslint-disable-next-line import/no-extraneous-dependencies
const visit = require('unist-util-visit');
const getYouTubeHTML = require('./get-youtube-html');
const getTwitterHTML = require('./get-twitter-html');
const getCodeSandboxHTML = require('./get-codesandbox-html');

const transformers = [getYouTubeHTML, getTwitterHTML, getCodeSandboxHTML];

module.exports = async ({ markdownAST, cache }) => {
  const transformations = [];
  visit(markdownAST, 'text', node => {
    const { value } = node;
    transformers.forEach(transformer => {
      if (transformer.shouldTransform(value)) {
        transformations.push(async () => {
          let html = await cache.get(value);
          if (!html) {
            html = await transformer(value);
            await cache.set(value, html);
          }
          node.type = `html`;
          node.value = html;
        });
      }
    });
  });
  const promises = transformations.map(t => t());
  await Promise.all(promises);

  return markdownAST;
};

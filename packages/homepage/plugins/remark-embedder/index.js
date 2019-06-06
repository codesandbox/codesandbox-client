// eslint-disable-next-line import/no-extraneous-dependencies
const visit = require('unist-util-visit');
const getYouTubeHTML = require('./get-youtube-html');
const getTwitterHTML = require('./get-twitter-html');
const getCodeSandboxHTML = require('./get-codesandbox-html');

const transformers = [getYouTubeHTML, getTwitterHTML, getCodeSandboxHTML];

const getUrlString = string => {
  const urlString = string.startsWith('http') ? string : `https://${string}`;

  try {
    return new URL(urlString).toString();
  } catch (error) {
    return null;
  }
};

module.exports = async ({ markdownAST, cache }) => {
  const transformations = [];
  visit(markdownAST, 'paragraph', paragraphNode => {
    if (paragraphNode.children.length !== 1) {
      return;
    }

    const [node] = paragraphNode.children;
    const isText = node.type === 'text';
    // it's a valid link if there's no title, and the value is the same as the URL
    const isValidLink =
      node.type === 'link' &&
      node.title === null &&
      node.children[0].value === node.url;
    if (!isText && !isValidLink) {
      return;
    }

    const { url, value = url } = node;

    const urlString = getUrlString(value);
    if (!urlString) {
      return;
    }

    transformers.forEach(transformer => {
      if (transformer.shouldTransform(urlString)) {
        transformations.push(async () => {
          let html = await cache.get(urlString);
          if (!html) {
            html = await transformer(urlString);
            await cache.set(urlString, html);
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

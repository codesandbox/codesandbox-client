const fetch = require('node-fetch');
const { URL } = require('url');

const getUrl = string => {
  if (!string.includes('twitter')) {
    return null;
  }

  const urlString = string.startsWith('http') ? string : `https://${string}`;
  let url;
  try {
    url = new URL(urlString);
  } catch (error) {
    return null;
  }

  if (!url.host.endsWith('twitter.com') || !url.pathname.includes('/status/')) {
    return null;
  }

  return url;
};
const shouldTransform = string => getUrl(string) !== null;

const getTwitterHtml = async string =>
  fetch(
    `https://publish.twitter.com/oembed?url=${string}&dnt=true&omit_script=true`
  )
    .then(r => r.json())
    .then(r =>
      [r.html]
        .map(s => s.replace(/\?ref_src=twsrc.*?fw/g, ''))
        .map(s => s.replace(/<br>/g, '<br />'))
        .join('')
        .trim()
    );

module.exports = getTwitterHtml;
module.exports.shouldTransform = shouldTransform;

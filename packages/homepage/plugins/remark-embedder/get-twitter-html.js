const fetch = require('node-fetch');
const { URL } = require('url');

const shouldTransform = string => {
  const { host, pathname } = new URL(string);

  return host.endsWith('twitter.com') && pathname.includes('/status/');
};

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

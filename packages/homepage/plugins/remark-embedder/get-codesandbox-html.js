const { URL } = require('url');

const shouldTransform = string =>
  new URL(string).host.endsWith('codesandbox.io');

const getCodeSandboxHTML = string => {
  const iframeUrl = string.replace('/s/', '/embed/');

  return `<iframe src="${iframeUrl}" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"></iframe>`;
};

module.exports = getCodeSandboxHTML;
module.exports.shouldTransform = shouldTransform;

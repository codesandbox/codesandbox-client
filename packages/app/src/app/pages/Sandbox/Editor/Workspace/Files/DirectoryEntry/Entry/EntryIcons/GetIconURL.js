import jsSvg from 'common/components/icons/js.svg';
import tsSvg from 'common/components/icons/ts.svg';
import cssSvg from 'common/components/icons/css.svg';
import reactSvg from 'common/components/icons/react.svg';
import folderSvg from 'common/components/icons/folder.svg';
import folderOpenSvg from 'common/components/icons/folder-open.svg';
import jsonSvg from 'common/components/icons/json.svg';
import reasonSvg from 'common/components/icons/reason.svg';
import yarnSvg from 'common/components/icons/yarn.svg';
import markdownSvg from 'common/components/icons/markdown.svg';
import faviconSvg from 'common/components/icons/favicon.svg';
import htmlSvg from 'common/components/icons/html.svg';
import npmSvg from 'common/components/icons/npm.svg';
import vueSvg from 'common/components/icons/vue.svg';
import fileSvg from 'common/components/icons/file.svg';
import svgSvg from 'common/components/icons/svg.svg';
import imageSvg from 'common/components/icons/image.svg';
import prettierSvg from 'common/components/icons/prettier.svg';
import codesandboxSvg from 'common/components/icons/codesandbox.svg';
import babelSvg from 'common/components/icons/babel.svg';
import sassSvg from 'common/components/icons/sass.svg';

function imageExists(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });
}

const icons = {
  directory: folderSvg,
  'directory-open': folderOpenSvg,
  react: reactSvg,
  css: cssSvg,
  json: jsonSvg,
  yarn: yarnSvg,
  markdown: markdownSvg,
  favicon: faviconSvg,
  html: htmlSvg,
  npm: npmSvg,
  vue: vueSvg,
  js: jsSvg,
  typescript: tsSvg,
  svg: svgSvg,
  image: imageSvg,
  prettier: prettierSvg,
  codesandbox: codesandboxSvg,
  babel: babelSvg,
  sass: sassSvg,
  reason: reasonSvg,
};

async function getIconURL(type) {
  const base =
    'https://cdn.rawgit.com/PKief/vscode-material-icon-theme/e04ab459/icons';

  let url;

  if (type === 'codesandbox') {
    url = codesandboxSvg;
  } else {
    url = `${base}/${type}.svg`;
  }

  try {
    await imageExists(url);

    return url;
  } catch (_) {
    return icons[type] || fileSvg;
  }
}

export default getIconURL;

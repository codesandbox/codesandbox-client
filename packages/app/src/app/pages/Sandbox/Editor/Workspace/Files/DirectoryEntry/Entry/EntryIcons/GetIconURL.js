import folderSvg from 'common/components/icons/folder.svg';
import folderOpenSvg from 'common/components/icons/folder-open.svg';
import faviconSvg from 'common/components/icons/favicon.svg';
import fileSvg from 'common/components/icons/file.svg';
import imageSvg from 'common/components/icons/image.svg';
import codesandboxSvg from 'common/components/icons/codesandbox.svg';
import nowSvg from 'common/components/icons/now.svg';

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
  favicon: faviconSvg,
  image: imageSvg,
  codesandbox: codesandboxSvg,
  now: nowSvg,
};

async function getIconURL(type) {
  const base =
    'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@e04ab459209a1d0c9fdb7b3682e5b4aa6d586090/icons';

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

import folderSvg from 'common/lib/components/icons/folder.svg';
import folderOpenSvg from 'common/lib/components/icons/folder-open.svg';
import faviconSvg from 'common/lib/components/icons/favicon.svg';
import fileSvg from 'common/lib/components/icons/file.svg';
import imageSvg from 'common/lib/components/icons/image.svg';
import codesandboxSvg from 'common/lib/components/icons/codesandbox.svg';
import nowSvg from 'common/lib/components/icons/now.svg';

function imageExists(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });
}

async function getIconURL(type) {
  const base =
    'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@e04ab459209a1d0c9fdb7b3682e5b4aa6d586090/icons';

  let url;

  switch (type) {
    case 'codesandbox':
      url = codesandboxSvg;
      break;

    case 'favicon':
      url = faviconSvg;
      break;

    case 'image':
      url = imageSvg;
      break;

    case 'now':
      url = nowSvg;
      break;

    case 'directory':
      url = folderSvg;
      break;

    case 'directory-open':
      url = folderOpenSvg;
      break;

    default:
      url = `${base}/${type}.svg`;
  }

  try {
    await imageExists(url);

    return url;
  } catch (_) {
    return fileSvg;
  }
}

export default getIconURL;

import fileSvg from '@codesandbox/common/lib/icons/file.svg';
import imageSvg from '@codesandbox/common/lib/icons/image.svg';
import codesandboxSvg from '@codesandbox/common/lib/icons/codesandbox.svg';
import nowSvg from '@codesandbox/common/lib/icons/now.svg';
import folderSvg from './folder.svg';
import folderOpenSvg from './folderOpen.svg';

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
    'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons';

  let url;

  switch (type) {
    case 'codesandbox':
      url = codesandboxSvg;
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

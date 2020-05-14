import CodeSandboxSvg from '@codesandbox/common/lib/icons/codesandbox.svg';
import fileSvg from '@codesandbox/common/lib/icons/file.svg';
import folderSvg from '@codesandbox/common/lib/icons/folder.svg';
import folderOpenSvg from '@codesandbox/common/lib/icons/folder-open.svg';
import imageSvg from '@codesandbox/common/lib/icons/image.svg';
import nowSvg from '@codesandbox/common/lib/icons/now.svg';

const imageExists = async (url: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  })
    .then(() => true)
    .catch(() => false);

const base =
  'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons';
export const getIconURL = async (type: string): Promise<string> => {
  const defaultURL = `${base}/${type}.svg`;
  const URLByType = {
    codesandbox: CodeSandboxSvg,
    image: imageSvg,
    now: nowSvg,
    directory: folderSvg,
    'directory-open': folderOpenSvg,
  };
  const url: string = URLByType[type] || defaultURL;

  if (await imageExists(url)) {
    return url;
  }

  return fileSvg;
};

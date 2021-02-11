import * as React from 'react';
import { IFiles } from 'smooshpack';
import { getParameters } from 'codesandbox-import-utils/lib/api/define';
import { useSandpack } from '../../contexts/sandpack-context';
import { FullScreenIcon } from '../../icons';

const getFileParameters = (files: IFiles) => {
  const normalized: {
    [path: string]: { content: string; isBinary: boolean };
  } = Object.keys(files).reduce(
    (prev, next) => ({
      ...prev,
      [next.replace('/', '')]: {
        content: files[next].code,
        isBinary: false,
      },
    }),
    {}
  );

  return getParameters({ files: normalized });
};

export const OpenInCodeSandboxButton: React.FC = () => {
  const { sandpack } = useSandpack();
  const params = getFileParameters(sandpack.files);

  return (
    <a
      title="Open in CodeSandbox"
      href={`https://codesandbox.io/api/v1/sandboxes/define?parameters=${params}&query=file=${sandpack.activePath}`}
      target="_blank"
      rel="noreferrer noopener"
      className="sp-button icon-standalone"
      style={{
        position: 'absolute',
        bottom: 'var(--sp-space-2)',
        right: 'var(--sp-space-2)',
        zIndex: 4,
      }}
    >
      <FullScreenIcon />
    </a>
  );
};

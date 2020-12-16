import React from 'react';
import { getParameters } from 'codesandbox-import-utils/lib/api/define';
import { IFiles } from '../types';
import { useSandpack } from '../utils/sandpack-context';

export interface Props {
  render?: () => React.ReactNode;
}

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

export const OpenInCodeSandboxButton: React.FC<Props> = ({ render }) => {
  const sandpack = useSandpack();

  return (
    <form
      action="https://codesandbox.io/api/v1/sandboxes/define"
      method="POST"
      target="_blank"
    >
      <input
        type="hidden"
        name="parameters"
        value={getFileParameters(sandpack.files)}
      />
      {typeof render === 'function' ? (
        render()
      ) : (
        <input type="submit" value="Open in CodeSandbox" />
      )}
    </form>
  );
};

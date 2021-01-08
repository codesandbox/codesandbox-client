import * as React from 'react';
import { getParameters } from 'codesandbox-import-utils/lib/api/define';
import { IFiles } from '../types';
import { useSandpack } from '../utils/sandpack-context';
import { styled } from '../stitches.config';

export interface OpenInCodeSandboxButtonProps {
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

export const OpenInCodeSandboxButton: React.FC<OpenInCodeSandboxButtonProps> = ({
  render,
}) => {
  const { sandpack } = useSandpack();

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
        <StyledInput type="submit">Open in CodeSandbox</StyledInput>
      )}
    </form>
  );
};

const StyledInput = styled('button', {
  width: 196,
  height: 40,
  background: 'rgba(0,0,0,0.6)',
  borderRadius: 4,
  border: 'none',
  zIndex: 214748366,
  color: 'white',
  fontSize: 16,
  transition: 'background 0.15s ease-in-out',

  ':hover': {
    background: 'rgba(0,0,0,0.7)',
  },
});

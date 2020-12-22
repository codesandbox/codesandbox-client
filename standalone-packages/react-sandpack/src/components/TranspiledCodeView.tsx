import React from 'react';
import { ISandpackContext } from '../types';
import { styled } from '../stitches.config';
import { ErrorMessage } from '../elements';
import { useSandpack } from '../utils/sandpack-context';

export interface TranspiledCodeViewProps {
  style?: Object;
}

const Wrapper = styled('div', {
  position: 'relative',
  height: '100%',
  padding: '0.5rem',
});

function getTranspiledCode(sandpack: ISandpackContext) {
  const { openedPath, managerState } = sandpack;
  if (managerState == null) {
    return null;
  }

  const tModule = managerState.transpiledModules[openedPath + ':'];
  return tModule?.source?.compiledCode ?? null;
}

export const TranspiledCodeView: React.FC<TranspiledCodeViewProps> = props => {
  const { sandpack } = useSandpack();
  const transpiledCode = getTranspiledCode(sandpack);

  return (
    <Wrapper style={props.style}>
      <pre>{transpiledCode}</pre>
      {sandpack.errors.length > 0 && (
        <ErrorMessage>{sandpack.errors[0].message}</ErrorMessage>
      )}
    </Wrapper>
  );
};

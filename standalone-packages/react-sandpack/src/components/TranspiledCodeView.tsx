import * as React from 'react';
import { SandpackState } from '../types';
import { styled } from '../stitches.config';
import { ErrorMessage } from '../elements';
import { useSandpack } from '../utils/sandpack-context';
import { PrismHighlight } from './CodeViewer/PrismHighlight';

const Wrapper = styled('div', {
  position: 'relative',
  border: '1px solid $inactive',
  margin: -1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '$mainBackground',
});

function getTranspiledCode(sandpack: SandpackState) {
  const { activePath, managerState } = sandpack;
  if (managerState == null) {
    return null;
  }

  const tModule = managerState.transpiledModules[activePath + ':'];
  return tModule?.source?.compiledCode ?? null;
}

export const TranspiledCodeView: React.FC = () => {
  const { sandpack } = useSandpack();
  const transpiledCode = getTranspiledCode(sandpack);

  return (
    <Wrapper>
      {transpiledCode && <PrismHighlight code={transpiledCode} />}
      {sandpack.errors.length > 0 && (
        <ErrorMessage>{sandpack.errors[0].message}</ErrorMessage>
      )}
    </Wrapper>
  );
};

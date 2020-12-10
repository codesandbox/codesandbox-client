import * as React from 'react';
import { ISandpackContext } from '../../types';
import SandpackConsumer from '../SandpackConsumer';
import { styled } from '../../stitches.config';
import { ErrorMessage } from '../../elements';

export interface Props {
  style?: Object;
}

const Wrapper = styled('div', {
  position: 'relative',
  height: '100%',
  padding: '0.5rem',
});

export default class TranspiledCodeView extends React.Component<Props> {
  getTranspiledCode(sandpack: ISandpackContext) {
    const { openedPath, managerState } = sandpack;
    if (managerState == null) {
      return null;
    }

    const tModule = managerState.transpiledModules[openedPath + ':'];
    return tModule?.source?.compiledCode ?? null;
  }

  render() {
    return (
      <SandpackConsumer>
        {sandpack => {
          const transpiledCode = this.getTranspiledCode(sandpack);

          return (
            <Wrapper style={this.props.style}>
              <pre>{transpiledCode}</pre>
              {sandpack.errors.length > 0 && (
                <ErrorMessage>{sandpack.errors[0].message}</ErrorMessage>
              )}
            </Wrapper>
          );
        }}
      </SandpackConsumer>
    );
  }
}

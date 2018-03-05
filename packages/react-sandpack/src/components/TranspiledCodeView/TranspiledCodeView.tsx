import * as React from 'react';
import { listen } from 'codesandbox-api';
import { Controlled } from 'react-codemirror2';

import { ISandpackContext } from '../../types';

import SandpackConsumer from '../SandpackConsumer';
import CodeMirrorComponent from '../../helper-components/CodeMirror';

export interface Props {
  style?: Object;
}

export interface State {
  managerState: any;
}

export default class TranspiledCodeView extends React.Component<Props, State> {
  getTranspiledCode(sandpack: ISandpackContext) {
    const { openedPath, managerState } = sandpack;
    if (managerState == null) {
      return null;
    }

    const tModule = managerState.transpiledModules[openedPath + ':'];
    if (tModule && tModule.source) {
      const { compiledCode } = tModule.source;

      if (compiledCode) {
        return compiledCode;
        // .replace(/\/\/# sourceMappingURL.*/, '')
        // .replace(/\/\/# sourceURL.*/, '');
      }
    }

    return null;
  }

  render() {
    return (
      <SandpackConsumer>
        {sandpack => (
          <CodeMirrorComponent
            style={this.props.style}
            onBeforeChange={() => {
              /* empty */
            }}
            value={this.getTranspiledCode(sandpack) || '// loading...'}
          />
        )}
      </SandpackConsumer>
    );
  }
}

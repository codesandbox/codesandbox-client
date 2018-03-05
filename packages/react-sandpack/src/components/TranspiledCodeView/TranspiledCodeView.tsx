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
  listener: Function;

  constructor(props: Props) {
    super(props);
    this.listener = listen(this.handleMessage);

    this.state = {
      managerState: null,
    };
  }

  componentWillUnmount() {
    this.listener();
  }

  handleMessage = (message: any) => {
    if (message.type === 'success') {
      this.setState({ managerState: message.state });
    }
  };

  getTranspiledCode(sandpack: ISandpackContext) {
    const { managerState } = this.state;
    if (managerState == null) {
      return null;
    }

    const { openedPath } = sandpack;

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

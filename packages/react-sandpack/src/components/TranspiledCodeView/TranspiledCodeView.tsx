import * as React from 'react';
import { listen } from 'codesandbox-api';
import { Controlled } from 'react-codemirror2';

import classNames from 'classnames';

import { ISandpackContext } from '../../types';

import cn from '../../utils/cn';
import SandpackConsumer from '../SandpackConsumer';
import CodeMirrorComponent from '../../helper-components/CodeMirror';

export interface Props {
  style?: Object;
  className?: string;
}

export interface State {
  error?: {
    title: string;
    message: string;
    path: string;
    line: number;
    column: number;
  };
}

export default class TranspiledCodeView extends React.Component<Props, State> {
  listener: Function;

  constructor(props: Props) {
    super(props);

    this.listener = listen(this.handleMessage);
    this.state = {};
  }

  handleMessage = (m: any) => {
    if (m.type === 'action' && m.action === 'show-error') {
      const { title, path, message, line, column } = m;
      this.setState({ error: { title, path, message, line, column } });
    } else if (m.type === 'success') {
      this.setState({ error: undefined });
    }
  };

  componentWillUnmount() {
    this.listener();
  }

  getTranspiledCode(sandpack: ISandpackContext) {
    const { openedPath, managerState } = sandpack;
    if (managerState == null) {
      return null;
    }

    const tModule = managerState.transpiledModules[managerState.entry + ':'];
    if (tModule && tModule.source) {
      const { compiledCode } = tModule.source;

      if (compiledCode) {
        return compiledCode;
      }
    }

    return null;
  }

  render() {
    const className = classNames(
      cn('TranspiledCodeView', 'container'),
      this.props.className
    );

    return (
      <SandpackConsumer>
        {sandpack => (
          <div className={className} style={this.props.style}>
            <CodeMirrorComponent
              onBeforeChange={() => {
                /* empty */
              }}
              value={this.getTranspiledCode(sandpack) || '// loading...'}
            />
            {this.state.error && (
              <div className={cn('TranspiledCodeView', 'error')}>
                {this.state.error.message}
              </div>
            )}
          </div>
        )}
      </SandpackConsumer>
    );
  }
}

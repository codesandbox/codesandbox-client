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

export default class TranspiledCodeView extends React.Component<Props> {
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
            {sandpack.errors.length && (
              <div className={cn('TranspiledCodeView', 'error')}>
                {sandpack.errors[0].message}
              </div>
            )}
          </div>
        )}
      </SandpackConsumer>
    );
  }
}

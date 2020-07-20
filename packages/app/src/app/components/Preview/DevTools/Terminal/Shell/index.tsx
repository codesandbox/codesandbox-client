import React from 'react';
import { listen, dispatch } from 'codesandbox-api';
import { withTheme } from 'styled-components';
import { debounce } from 'lodash-es';

import { VSTheme } from '../terminal-theme';
import { TerminalWithFit } from '../types';
import { TerminalComponent } from './Term';

type Props = {
  id: string;
  theme: VSTheme;
  owned: boolean;
  script?: string;
  closeShell: () => void;
  endShell: () => void;
  ended: boolean;
  hidden: boolean;
  updateStatus?: (type: string, count?: number) => void;
};

class ShellComponent extends React.PureComponent<Props> {
  listener: Function;
  term: TerminalWithFit;
  node?: HTMLDivElement;

  initializeTerminal = (terminal: TerminalWithFit) => {
    this.term = terminal;

    this.term.on('data', data => {
      if (!this.props.ended) {
        dispatch({
          type: 'socket:message',
          channel: 'shell:in',
          id: this.props.id,
          data,
        });
      }
    });

    this.listener = listen(this.handleMessage);
    this.sendResize = debounce(this.sendResize, 100);

    this.term.on('resize', ({ cols, rows }) => {
      this.sendResize(cols, rows);
    });

    dispatch({
      type: 'socket:message',
      channel: 'shell:start',
      id: this.props.id,
      cols: this.term.cols,
      rows: this.term.rows,
      script: this.props.script,
    });

    this.term.focus();
  };

  sendResize = (cols: number, rows: number) => {
    if (!this.props.ended) {
      dispatch({
        type: 'socket:message',
        channel: 'shell:resize',
        cols,
        rows,
        id: this.props.id,
      });
    }
  };

  handleMessage = (data: any) => {
    if (data.id === this.props.id) {
      if (data.type === 'shell:out' && !this.props.ended) {
        this.term.write(data.data);

        if (this.props.updateStatus) {
          this.props.updateStatus('info');
        }
      } else if (data.type === 'shell:exit') {
        if (!this.props.script) {
          setTimeout(() => {
            this.props.closeShell();
          }, 300);
        } else {
          this.props.endShell();

          this.term.write(
            `\n\rSession finished with status code ${data.code}\n\r`
          );
        }
      } else if (data.type === 'codesandbox:sse:disconnect') {
        this.props.endShell();

        this.term.write(`\n\rConnection with the server has been lost\n\r`);
      }
    }
  };

  componentWillUnmount() {
    if (typeof this.listener === 'function') {
      this.listener();
    }

    dispatch({
      type: 'socket:message',
      channel: 'shell:close',
      id: this.props.id,
    });
  }

  render() {
    const { hidden, theme, owned } = this.props;
    return (
      <TerminalComponent
        owned={owned}
        hidden={hidden}
        theme={theme}
        onTerminalInitialized={this.initializeTerminal}
      />
    );
  }
}

export const Shell = withTheme(ShellComponent);

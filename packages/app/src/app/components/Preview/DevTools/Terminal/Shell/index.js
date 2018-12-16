// @flow
import React from 'react';
import { listen, dispatch } from 'codesandbox-api';
import styled, { withTheme } from 'styled-components';
import { Terminal } from 'xterm';
import { debounce } from 'lodash';
import * as fit from 'xterm/lib/addons/fit/fit';

import getTerminalTheme from '../terminal-theme';

type Props = {
  id: string,
  theme: any,
  script: ?string,
  closeShell: () => void,
  endShell: () => void,
  ended: boolean,
  hidden: boolean,
  height: number,
  updateStatus?: (type: string, count?: number) => void,
};

const Container = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  height: ${props => props.height - 72};
  padding: 0.5rem;
  visibility: ${props => (props.hidden ? 'hidden' : 'visible')};
`;

Terminal.applyAddon(fit);
class Shell extends React.PureComponent<Props> {
  listener: Function;
  term: Terminal;
  node: ?HTMLDivElement;
  timeout: TimeoutID;

  startTerminal = () => {
    // TODO: deduplicate all this by making this a general API that can be used
    // to show the results of npm commands as well as the results of shell
    this.term = new Terminal({
      theme: getTerminalTheme(this.props.theme),
      fontFamily: 'Source Code Pro',
      fontWeight: 'normal',
      fontWeightBold: 'bold',
      lineHeight: 1.3,
      fontSize: 14,
    });
    this.term.open(this.node);

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
    this.term.fit();

    dispatch({
      type: 'socket:message',
      channel: 'shell:start',
      id: this.props.id,
      cols: this.term.cols,
      rows: this.term.rows,
      script: this.props.script,
    });

    window.addEventListener('resize', this.listenForResize);

    this.term.focus();
  };

  componentDidMount() {
    // Do this in a timeout so we can spawn the new tab, the perceived speed will
    // be faster because of this.
    setTimeout(this.startTerminal, 100);
  }

  sendResize = (cols: number, rows: number) => {
    if (this.props.ended) {
      dispatch({
        type: 'socket:message',
        channel: 'shell:resize',
        cols,
        rows,
        id: this.props.id,
      });
    }
  };

  componentDidUpdate(prevProps: Props) {
    if (this.term) {
      if (prevProps.height !== this.props.height) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(
          () => {
            this.term.fit();
          },
          this.props.hidden ? 1500 : 300
        );
      }

      if (prevProps.hidden !== this.props.hidden && !this.props.hidden) {
        this.term.focus();
      }

      if (prevProps.theme !== this.props.theme) {
        this.term.setOption('theme', getTerminalTheme(this.props.theme));
      }
    }
  }

  listenForResize = () => {
    this.term.fit();
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
    this.listener();

    window.removeEventListener('resize', this.listenForResize);

    if (this.term) {
      this.term.dispose();
    }

    dispatch({
      type: 'socket:message',
      channel: 'shell:close',
      id: this.props.id,
    });
  }

  render() {
    const { height, hidden } = this.props;

    return (
      <Container
        hidden={hidden}
        height={height}
        ref={node => {
          this.node = node;
        }}
      />
    );
  }
}

export default withTheme(Shell);

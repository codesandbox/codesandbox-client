import React from 'react';
import { listen, dispatch } from 'codesandbox-api';
import { Terminal } from 'xterm';
import { debounce } from 'lodash';
import * as fit from 'xterm/lib/addons/fit/fit';

type Props = {
  id: string,
  // command: ?string,
  closeShell: () => void,
};

type State = {
  closed: boolean,
};

Terminal.applyAddon(fit);
export default class Shell extends React.Component<Props, State> {
  state = {
    closed: false,
  };

  componentDidMount() {
    // TODO: deduplicate all this by making this a general API that can be used
    // to show the results of npm commands as well as the results of shell
    this.term = new Terminal();
    this.term.open(this.node);

    this.term.setOption('theme', {
      background: '#1C2022',
    });
    this.term.setOption('fontFamily', 'Source Code Pro');
    this.term.setOption('fontWeight', 'normal');
    this.term.setOption('fontWeightBold', 'bold');
    this.term.setOption('lineHeight', 1.4);
    this.term.setOption('fontSize', 14);

    this.term.on('data', data => {
      if (!this.state.closed) {
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
    });

    window.addEventListener('resize', this.listenForResize);

    this.term.focus();
  }

  sendResize = (cols, rows) => {
    dispatch({
      type: 'socket:message',
      channel: 'shell:resize',
      cols,
      rows,
      id: this.props.id,
    });
  };

  componentDidUpdate(nextProps: Props) {
    if (nextProps.height !== this.props.height) {
      this.term.fit();
    }
  }

  listenForResize = () => {
    this.term.fit();
  };

  handleMessage = data => {
    if (data.id === this.props.id) {
      if (data.type === 'shell:out' && !this.state.closed) {
        if (data.data === 'logout\r\n' || data.data === 'exit\r\n') {
          setTimeout(() => {
            this.props.closeShell();
          }, 300);
        }
        this.term.write(data.data);

        if (this.props.updateStatus) {
          this.props.updateStatus('info');
        }
      } else if (data.type === 'shell:exit') {
        this.setState({ closed: true });

        this.term.write('\n\r[Session Closed]');
      }
    }
  };

  componentWillUnmount() {
    this.listener();

    window.removeEventListener('resize', this.listenForResize);

    dispatch({
      type: 'socket:message',
      channel: 'shell:close',
      id: this.props.id,
    });
  }

  render() {
    const { height, hidden } = this.props;

    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          height: height - 72,
          padding: '.5rem',
          visibility: hidden ? 'hidden' : 'visible',
        }}
        ref={node => {
          this.node = node;
        }}
      />
    );
  }
}

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

Terminal.applyAddon(fit);
export default class Shell extends React.PureComponent<Props> {
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
      dispatch({ type: 'shell:in', id: this.props.id, data });
    });

    this.listener = listen(this.handleMessage);

    this.sendResize = debounce(this.sendResize, 100);

    this.term.on('resize', ({ cols, rows }) => {
      this.sendResize(cols, rows);
    });
    this.term.fit();
    dispatch({
      type: 'shell:start',
      id: this.props.id,
      cols: this.term.cols,
      rows: this.term.rows,
    });
  }

  sendResize = (cols, rows) => {
    dispatch({
      type: 'shell:resize',
      cols,
      rows,
    });
  };

  componentDidUpdate(nextProps: Props) {
    if (nextProps.height !== this.props.height) {
      this.term.fit();
    }
  }

  handleMessage = data => {
    if (data.type === 'shell:out' && data.id === this.props.id) {
      if (data.data === 'exit\r\n') {
        this.props.closeShell();
      }
      this.term.write(data.data);

      if (this.props.updateStatus) {
        this.props.updateStatus('info');
      }
    }
  };

  componentWillUnmount() {
    this.listener();

    // Shell stop somewhere?
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

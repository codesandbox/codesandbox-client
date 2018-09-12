import React from 'react';
import { listen, dispatch } from 'codesandbox-api';
import { Terminal } from 'xterm';
import { debounce } from 'lodash';
import * as fit from 'xterm/lib/addons/fit/fit';

Terminal.applyAddon(fit);
export default class Shell extends React.PureComponent {
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
      dispatch({ type: 'shell:in', data });
    });

    this.listener = listen(this.handleMessage);

    this.sendResize = debounce(this.sendResize, 100);

    this.term.on('resize', ({ cols, rows }) => {
      this.sendResize(cols, rows);
    });
    this.term.fit();
    dispatch({
      type: 'shell:start',
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
    if (data.type === 'shell:out') {
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
          top: '2rem',
          bottom: 0,
          left: 0,
          right: 0,
          height: height - 64,
          padding: '2rem',
          // display: hidden ? 'none' : 'block',
          visibility: hidden ? 'hidden' : 'visible',
        }}
        ref={node => {
          this.node = node;
        }}
      />
    );
  }
}

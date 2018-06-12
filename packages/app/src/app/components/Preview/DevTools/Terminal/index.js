import React from 'react';
import { listen } from 'codesandbox-api';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import getTemplate from 'common/templates';
import './styles.css';

Terminal.applyAddon(fit);
class TerminalComponent extends React.PureComponent {
  componentDidMount() {
    this.term = new Terminal();
    this.term.open(this.node);
    this.term.fit();

    this.term.setOption('theme', {
      background: '#1c2022',
    });
    this.term.setOption('fontFamily', 'Menlo');
    this.term.setOption('lineHeight', 1.3);

    this.listener = listen(this.handleMessage);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.height !== this.props.height) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.term.fit();
      }, 300);
    }
  }

  handleMessage = data => {
    if (data.type === 'terminal:message') {
      this.term.writeln(data.data.trim());

      if (this.props.updateStatus) {
        this.props.updateStatus('info');
      }
    }
  };

  componentWillUnmount() {
    this.listener();
  }

  render() {
    const { height, hidden, style } = this.props;

    return (
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          bottom: 0,
          left: 0,
          right: 0,
          height,
          padding: '1rem',
          visibility: hidden ? 'hidden' : 'visible',
        }}
        ref={node => {
          this.node = node;
        }}
      />
    );
  }
}

export default {
  title: 'Terminal',
  Content: TerminalComponent,
  actions: [],
  show: template => {
    return getTemplate(template).isServer;
  },
};

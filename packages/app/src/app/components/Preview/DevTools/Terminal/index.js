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
      background: '#141618',
    });
    this.term.setOption('fontFamily', 'Source Code Pro');
    this.term.setOption('fontWeight', 'normal');
    this.term.setOption('fontWeightBold', 'bold');
    this.term.setOption('lineHeight', 1.4);
    this.term.setOption('fontSize', 14);

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
      this.term.write(data.data);

      if (this.props.updateStatus) {
        this.props.updateStatus('info');
      }
    }
  };

  componentWillUnmount() {
    this.listener();
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
          height: height - 48,
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
  show: template => getTemplate(template).isServer,
};

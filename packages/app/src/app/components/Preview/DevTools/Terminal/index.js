import React from 'react';
import { listen } from 'codesandbox-api';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import getTemplate from 'common/templates';
import './styles.css';
import Shell from './Shell';

Terminal.applyAddon(fit);
class TerminalComponent extends React.PureComponent {
  state = {
    shellTabOpen: false,
    shellTabStarted: false,
  };

  componentDidMount() {
    this.term = new Terminal();
    this.term.open(this.node);
    this.term.fit();

    this.term.setOption('theme', {
      background: '#1C2022',
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
      <div>
        <button
          style={{ zIndex: 200, position: 'absolute' }}
          onClick={() => {
            console.log('opening or closing');
            this.setState(s => ({
              shellTabOpen: !s.shellTabOpen,
              shellTabStarted: true,
            }));
          }}
        >
          Toggle Tab
        </button>
        <div
          style={{
            position: 'absolute',
            top: '2rem',
            bottom: 0,
            left: 0,
            right: 0,
            height: height - 48,
            padding: '1rem',
            visibility:
              hidden || this.state.shellTabOpen ? 'hidden' : 'visible',
          }}
          ref={node => {
            this.node = node;
          }}
        />
        {this.state.shellTabStarted && (
          <Shell height={height} hidden={!this.state.shellTabOpen} />
        )}
      </div>
    );
  }
}

export default {
  title: 'Terminal',
  Content: TerminalComponent,
  actions: [],
  show: template => getTemplate(template).isServer,
};

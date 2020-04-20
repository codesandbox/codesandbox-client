import React from 'react';
import { withTheme } from 'styled-components';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';

import ResizeObserver from 'resize-observer-polyfill';

import getTerminalTheme, {
  VSTheme,
  flattenTerminalTheme,
} from '../terminal-theme';
import { TerminalWithFit } from '../types';

type Props = {
  theme: VSTheme;
  owned: boolean;
  hidden: boolean;
  onTerminalInitialized: (term: TerminalWithFit) => void;
};

Terminal.applyAddon(fit);
export class TerminalComponentNoTheme extends React.PureComponent<Props> {
  term: TerminalWithFit;
  node?: HTMLDivElement;
  timeout?: number;
  observer: ResizeObserver;

  startTerminal = () => {
    let theme = this.props.theme;
    // @ts-ignore ignore because it shouldnt exist :)
    if (this.props.theme.vscodeTheme.colors.terminal) {
      theme = flattenTerminalTheme(theme);
    }
    // @ts-ignore
    this.term = new Terminal({
      theme: getTerminalTheme(theme),
      fontFamily: 'Source Code Pro',
      fontWeight: 'normal',
      fontWeightBold: 'bold',
      lineHeight: 1.3,
      fontSize: 14,
    });
    this.term.open(this.node);
    this.resizeTerminal();
    window.addEventListener('resize', this.listenForResize);

    this.props.onTerminalInitialized(this.term);
  };

  setupResizeObserver = (el: HTMLDivElement) => {
    this.observer = new ResizeObserver(() => {
      clearTimeout(this.timeout);
      this.timeout = window.setTimeout(() => {
        this.resizeTerminal();
      }, 300);
    });

    this.observer.observe(el);
  };

  componentDidMount() {
    // Do this in a timeout so we can spawn the new tab, the perceived speed will
    // be faster because of this.
    setTimeout(this.startTerminal, 100);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.term) {
      if (prevProps.hidden !== this.props.hidden && !this.props.hidden) {
        this.term.focus();
      }

      if (
        JSON.stringify(prevProps.theme) !== JSON.stringify(this.props.theme)
      ) {
        this.term.setOption('theme', getTerminalTheme(this.props.theme));
      }
    }
  }

  listenForResize = () => {
    this.resizeTerminal();
  };

  resizeTerminal = () => {
    this.term.fit();
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.listenForResize);

    if (this.term) {
      this.term.dispose();
    }

    if (this.observer) {
      this.observer.disconnect();
    }
  }

  render() {
    const { hidden } = this.props;

    return (
      <div
        style={{
          position: 'absolute',
          top: 8,
          bottom: 0,
          left: 8,
          right: 8,
          paddingBottom: 0,
          visibility: hidden ? 'hidden' : 'visible',
        }}
        ref={node => {
          if (node && !this.node) {
            this.node = node;
            this.setupResizeObserver(node);
          }
        }}
      />
    );
  }
}

export const TerminalComponent = withTheme(TerminalComponentNoTheme);

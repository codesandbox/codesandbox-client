// @flow
import React from 'react';
import { listen, dispatch } from 'codesandbox-api';
import { withTheme } from 'styled-components';
import { Terminal } from 'xterm';
import { debounce } from 'lodash-es';
import * as fit from 'xterm/lib/addons/fit/fit';

import ResizeObserver from 'resize-observer-polyfill';

import getTerminalTheme, { VSTheme } from '../terminal-theme';
import { TerminalWithFit } from '../types';

type Props = {
  theme: VSTheme;
  hidden: boolean;
  height: number;
  onTerminalInitialized: (term: TerminalWithFit) => void;
};

Terminal.applyAddon(fit);
export class TerminalComponent extends React.PureComponent<Props> {
  term: TerminalWithFit;
  node?: HTMLDivElement;
  timeout?: number;
  observer: ResizeObserver;

  startTerminal = () => {
    // @ts-ignore
    this.term = new Terminal({
      theme: getTerminalTheme(this.props.theme),
      fontFamily: 'Source Code Pro',
      fontWeight: 'normal',
      fontWeightBold: 'bold',
      lineHeight: 1.3,
      fontSize: 14,
    });
    this.term.open(this.node);
    this.term.fit();
    window.addEventListener('resize', this.listenForResize);

    this.props.onTerminalInitialized(this.term);
  };

  setupResizeObserver = (el: HTMLDivElement) => {
    this.observer = new ResizeObserver(() => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.term.fit();
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

      if (
        JSON.stringify(prevProps.theme) !== JSON.stringify(this.props.theme)
      ) {
        this.term.setOption('theme', getTerminalTheme(this.props.theme));
      }
    }
  }

  listenForResize = () => {
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
          if (node && !this.node) {
            this.node = node;
            this.setupResizeObserver(node);
          }
        }}
      />
    );
  }
}

export default withTheme(TerminalComponent);

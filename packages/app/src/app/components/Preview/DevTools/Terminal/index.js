// @flow
import React from 'react';
import { listen } from 'codesandbox-api';
import styled, { withTheme } from 'styled-components';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import getTemplate, { type Template } from 'common/templates';
import uuid from 'uuid';
import PlusIcon from 'react-icons/lib/md/add';
import Relative from 'common/components/Relative';

import getTerminalTheme from './terminal-theme';

import './styles.css';

import Shell from './Shell';
import ShellTabs from './ShellTabs';

export type ShellT = {
  id: string,
  title: string,
  script: ?string,
  ended: boolean,
};

type State = {
  shells: Array<ShellT>,
  selectedShell: ?string,
};

type Props = {
  hidden: boolean,
  height: number,
  updateStatus?: (type: string, count?: number) => void,
  theme: any,
  openDevTools: () => void,
  selectCurrentPane: () => void,
};

const Container = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  height: ${props => props.height - 72};
  padding: 1rem;
  visibility: ${props => (props.hidden ? 'hidden' : 'visible')};
`;

// Incredibly hacky way of letting the StatusBar access the state of the component.
// In the future we need to abstract this away to the global state and dispatch an event.
let createShell;

Terminal.applyAddon(fit);
class TerminalComponent extends React.Component<Props, State> {
  state = {
    shells: [],
    selectedShell: null,
  };
  term: Terminal;
  node: ?HTMLElement;
  timeout: TimeoutID;
  listener: () => void;

  componentDidMount() {
    createShell = this.createShell;

    this.term = new Terminal({
      rendererType: 'dom',
      theme: getTerminalTheme(this.props.theme),
      fontFamily: 'Source Code Pro',
      fontWeight: 'normal',
      fontWeightBold: 'bold',
      lineHeight: 1.3,
      fontSize: 14,
    });
    this.term.open(this.node);
    this.term.fit();

    this.listener = listen(this.handleMessage);
  }

  componentWillUpdate(nextProps: Props) {
    if (nextProps.height !== this.props.height) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.term.fit();
      }, 300);
    }

    if (nextProps.theme !== this.props.theme) {
      this.term.setOption('theme', getTerminalTheme(nextProps.theme));
    }
  }

  handleMessage = (data: any) => {
    if (data.type === 'terminal:message') {
      this.term.write(data.data);

      if (this.props.updateStatus) {
        this.props.updateStatus('info');
      }
    } else if (data.type === 'codesandbox:create-shell') {
      this.props.openDevTools();
      this.props.selectCurrentPane();

      this.createShell(data.script);
    }
  };

  componentWillUnmount() {
    createShell = undefined;
    this.listener();

    if (this.term) {
      this.term.dispose();
    }
  }

  createShell = (script?: string) => {
    const newShell = {
      id: uuid.v4(),
      title: script ? `yarn ${script}` : '/bin/bash',
      script,
      ended: false,
    };

    this.setState(s => ({
      shells: [...s.shells, newShell],
      selectedShell: newShell.id,
    }));
  };

  selectShell = (shellId: ?string) => {
    this.setState({ selectedShell: shellId });
  };

  getShellIdLeftOfCurrentShell = () => {
    const { shells, selectedShell } = this.state;
    const currentIndex = shells.findIndex(s => s.id === selectedShell);

    const newShell = shells[currentIndex - 1];
    if (newShell) {
      return newShell.id;
    }

    return null;
  };

  closeShell = (shellId: string) => {
    this.setState(s => {
      const selectedShell =
        shellId === s.selectedShell
          ? this.getShellIdLeftOfCurrentShell()
          : s.selectedShell;

      return {
        selectedShell,
        shells: s.shells.filter(x => x.id !== shellId),
      };
    });
  };

  /**
   * End the shell itself, this means that we won't close the shell tab
   * but mark it as closed. This is done when the server kills the shell and
   * we still want to show output.
   */
  endShell = (shellId: string) => {
    this.setState(s => ({
      shells: s.shells.map(shell =>
        shell.id === shellId ? { ...shell, ended: true } : shell
      ),
    }));
  };

  render() {
    const { height, hidden } = this.props;

    return (
      <div>
        {!hidden && this.state.shells.length > 0 && (
          <ShellTabs
            selectedShell={this.state.selectedShell}
            shells={this.state.shells}
            selectShell={this.selectShell}
            closeShell={this.closeShell}
          />
        )}

        <Relative>
          <Container
            hidden={hidden || this.state.selectedShell !== null}
            height={height}
            ref={node => {
              this.node = node;
            }}
          />
          {this.state.shells.map(shell => (
            <Shell
              key={shell.id}
              id={shell.id}
              script={shell.script}
              ended={shell.ended}
              height={height}
              hidden={hidden || shell.id !== this.state.selectedShell}
              closeShell={() => this.closeShell(shell.id)}
              endShell={() => this.endShell(shell.id)}
            />
          ))}
        </Relative>
      </div>
    );
  }
}

export default {
  title: 'Terminal',
  Content: withTheme(TerminalComponent),
  actions: (owner: boolean) =>
    [
      owner && {
        title: 'Add Terminal',
        onClick: () => {
          if (createShell) {
            createShell();
          }
        },
        Icon: PlusIcon,
      },
    ].filter(Boolean),
  show: (template: Template) => getTemplate(template).isServer,
};

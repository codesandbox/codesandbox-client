import './styles.css';

import { listen, dispatch } from 'codesandbox-api';
import React from 'react';
import PlusIcon from 'react-icons/lib/md/add';
import { withTheme } from 'styled-components';
import uuid from 'uuid';

import { notificationState } from '@codesandbox/common/lib/utils/notifications';
import { NotificationStatus } from '@codesandbox/notifications';
import { Shell } from './Shell';
import { TerminalComponent } from './Shell/Term';
import { ShellTabs } from './ShellTabs';
import { ShellT, TerminalWithFit } from './types';
import { DevToolProps } from '..';

type State = {
  shells: ShellT[];
  selectedShell: string | undefined;
};

// Incredibly hacky way of letting the StatusBar access the state of the component.
// In the future we need to abstract this away to the global state and dispatch an event.
// We need to keep all the tabs in the global state and work from there.
let createShell: (() => void) | undefined;

class DevToolTerminal extends React.Component<
  DevToolProps & { theme: any },
  State
> {
  state: State = {
    shells: [],
    selectedShell: undefined,
  };

  term: TerminalWithFit;
  messageQueue: unknown[] = [];
  listener: () => void;
  node?: HTMLElement;
  timeout?: number;
  shownReadonlyNotification: boolean = false;

  componentDidMount() {
    createShell = this.createShell;

    this.listener = listen(this.handleMessage);
  }

  setTerminal = (terminal: TerminalWithFit) => {
    this.term = terminal;

    this.messageQueue.forEach(this.handleMessage);
    this.messageQueue.length = 0;

    terminal.on('data', () => {
      if (this.props.owned) {
        if (!this.shownReadonlyNotification) {
          notificationState.addNotification({
            title: 'Terminal Read-Only',
            message:
              "The main terminal is read-only and runs what's defined in package.json#dev, you can create a new terminal to input commands",
            status: NotificationStatus.NOTICE,
            actions: {
              primary: {
                label: 'Create Terminal',
                run: () => {
                  dispatch({
                    type: 'codesandbox:create-shell',
                  });
                },
              },
            },
          });
        }
        this.shownReadonlyNotification = true;
      }
    });
  };

  handleMessage = (data: any) => {
    if (!this.term) {
      this.messageQueue.push(data);
      return;
    }

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

  selectShell = (shellId?: string) => {
    this.setState({ selectedShell: shellId });
  };

  getShellIdLeftOfCurrentShell = () => {
    const { shells, selectedShell } = this.state;
    const currentIndex = shells.findIndex(s => s.id === selectedShell);

    const newShell = shells[currentIndex - 1];
    if (newShell) {
      return newShell.id;
    }

    return undefined;
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
    const { hidden, theme, owned } = this.props;
    const { selectedShell } = this.state;

    return (
      <div className="terminal">
        {!hidden && owned && (
          <ShellTabs
            selectedShell={this.state.selectedShell}
            shells={this.state.shells}
            selectShell={this.selectShell}
            closeShell={this.closeShell}
            createShell={this.createShell}
          />
        )}

        <div style={{ position: 'relative', flex: 'auto' }}>
          <TerminalComponent
            hidden={hidden || selectedShell !== undefined}
            owned={this.props.owned}
            theme={theme}
            onTerminalInitialized={this.setTerminal}
          />
          {this.state.shells.map(shell => (
            <Shell
              key={shell.id}
              id={shell.id}
              script={shell.script}
              ended={shell.ended}
              owned={this.props.owned}
              hidden={hidden || shell.id !== this.state.selectedShell}
              closeShell={() => this.closeShell(shell.id)}
              endShell={() => this.endShell(shell.id)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export const terminal = {
  id: 'codesandbox.terminal',
  title: 'Terminal',
  Content: withTheme(DevToolTerminal),
  actions: ({ owned }) =>
    [
      !owned && {
        title: 'Fork to add a terminal',
        onClick: () => {
          if (createShell && owned) {
            createShell();
          }
        },
        Icon: PlusIcon,
        disabled: !owned,
      },
    ].filter(Boolean),
};

import * as React from 'react';
import { listen, dispatch, actions } from 'codesandbox-api';
import {
  CorrectionAction,
  CorrectionClearAction,
} from 'codesandbox-api/dist/types/actions/correction';
import {
  ErrorAction,
  ErrorClearAction,
} from 'codesandbox-api/dist/types/actions/error';
import { Console } from 'console-feed';
import immer from 'immer';

import { inspectorTheme } from '../Console/elements';

import { Container, File } from './elements';
import { DevToolProps } from '..';

import { FileErrors } from './FileErrors';

export type MessageType = CorrectionAction | ErrorAction;

type State = {
  corrections: {
    [path: string]: MessageType[];
    root?: MessageType[];
  };
};

class Problems extends React.PureComponent<DevToolProps, State> {
  state: State = {
    corrections: {},
  };
  listener: Function;

  componentDidMount() {
    this.listener = listen(this.handleMessage);
  }

  componentWillUnmount() {
    this.listener();
  }

  handleMessage = data => {
    if (data.action === 'show-correction') {
      const correction: CorrectionAction = data;
      correction.path = correction.path || 'root';

      const newMessages = [
        ...(this.state.corrections[correction.path] || []),
        correction,
      ];

      this.setState({
        corrections: {
          ...this.state.corrections,
          [correction.path]: newMessages,
        },
      });

      this.props.updateStatus('warning');
    } else if (data.action === 'show-error') {
      const correction: ErrorAction = data;
      correction.path = correction.path || 'root';

      const newMessages = [
        ...(this.state.corrections[correction.path] || []),
        correction,
      ];

      this.setState({
        corrections: {
          ...this.state.corrections,
          [correction.path]: newMessages,
        },
      });

      this.props.updateStatus('error');
    } else if (
      data.action === 'clear-corrections' ||
      data.action === 'clear-errors'
    ) {
      const message: CorrectionClearAction | ErrorClearAction = data;
      const path = message.path || 'root';
      console.log('got it', message);

      const newState = immer(this.state.corrections, draft => {
        const clearCorrections = (clearPath: string) => {
          if (draft[clearPath]) {
            draft[clearPath] = draft[clearPath].filter(
              corr => corr.source !== message.source
            );
          }
        };

        if (path === '*') {
          Object.keys(draft).forEach(p => {
            clearCorrections(p);
          });
        } else {
          clearCorrections(path);
        }
      });

      this.setState({ corrections: newState });
      this.props.updateStatus('clear');
    }
  };

  openFile = (path: string) => {
    dispatch(actions.editor.openModule(path));
  };

  render() {
    if (this.props.hidden) {
      return null;
    }

    const files = Object.keys(this.state.corrections)
      .sort()
      .filter(x => x !== 'root');

    const root = this.state.corrections.root;

    return (
      <Container>
        {Object.keys(this.state.corrections).length === 0 && (
          <div style={{ padding: '1rem' }}>No problems!</div>
        )}
        {root && (
          <div>
            <File>Root</File>
            <Console logs={root} variant="dark" styles={inspectorTheme} />
          </div>
        )}
        {files.map(
          file =>
            this.state.corrections[file] && (
              <FileErrors
                key={file}
                file={file}
                corrections={this.state.corrections[file]}
              />
            )
        )}
      </Container>
    );
  }
}

export default {
  id: 'codesandbox.problems',
  title: 'Problems',
  Content: Problems,
  actions: [],
};

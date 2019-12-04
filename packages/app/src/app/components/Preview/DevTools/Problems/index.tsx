import { listen } from 'codesandbox-api';
import {
  CorrectionAction,
  CorrectionClearAction,
} from 'codesandbox-api/dist/types/actions/correction';
import {
  ErrorAction,
  ErrorClearAction,
} from 'codesandbox-api/dist/types/actions/error';
import immer from 'immer';
import React from 'react';

import { DevToolProps } from '..';
import { Container } from './elements';
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

  listener: () => void;

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
      this.setState(state => {
        const newMessages = [
          ...(state.corrections[correction.path] || []),
          correction,
        ];

        return {
          corrections: {
            ...state.corrections,
            [correction.path]: newMessages,
          },
        };
      });

      this.props.updateStatus('warning');
    } else if (data.action === 'show-error') {
      const correction: ErrorAction = data;
      correction.path = correction.path || 'root';
      this.setState(state => {
        const newMessages = [
          ...(state.corrections[correction.path] || []),
          correction,
        ];

        return {
          corrections: {
            ...state.corrections,
            [correction.path]: newMessages,
          },
        };
      });

      this.props.updateStatus('error');
    } else if (
      data.action === 'clear-corrections' ||
      data.action === 'clear-errors'
    ) {
      const message: CorrectionClearAction | ErrorClearAction = data;
      const path = message.path || 'root';

      this.setState(
        state => ({
          corrections: immer(state.corrections, draft => {
            const clearCorrections = (clearPath: string) => {
              if (draft[clearPath]) {
                draft[clearPath] = draft[clearPath].filter(
                  corr => corr.source !== message.source
                );

                if (Object.keys(draft[clearPath]).length === 0) {
                  delete draft[clearPath];
                }
              }
            };

            if (path === '*') {
              Object.keys(draft).forEach(p => {
                clearCorrections(p);
              });
            } else {
              clearCorrections(path);
            }
          }),
        }),
        () => {
          this.setUpdatedStatus();
        }
      );
    }
  };

  setUpdatedStatus = () => {
    const messages: MessageType[] = Object.keys(this.state.corrections).reduce(
      (p, n) => p.concat(this.state.corrections[n]),
      []
    );
    const count = messages.length;
    const isError = messages.some(m => m.severity === 'error');

    this.props.updateStatus(isError ? 'error' : 'warning', count);
  };

  render() {
    if (this.props.hidden) {
      return null;
    }

    const files = Object.keys(this.state.corrections)
      .sort()
      .filter(x => x !== 'root');

    const { root } = this.state.corrections;

    return (
      <Container>
        {Object.keys(this.state.corrections).length === 0 && (
          <div style={{ padding: '1rem' }}>No problems!</div>
        )}
        {root && (
          <div>
            <FileErrors key="root" file="root" corrections={root} />
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

export const problems = {
  id: 'codesandbox.problems',
  title: 'Problems',
  Content: Problems,
  actions: [],
};

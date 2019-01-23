import React from 'react';
import { listen, dispatch, actions } from 'codesandbox-api';
import Tooltip from 'common/components/Tooltip';
import getTemplate, { type Template } from 'common/templates';
import FileIcon from 'react-icons/lib/md/insert-drive-file';

import { Console } from 'console-feed';
import { inspectorTheme } from '../Console/elements';

import { Container, File, Path, FileName, Actions } from './elements';

type State = {
  corrections: {
    [path: string]: Array<string>,
  },
};

class Problems extends React.PureComponent<*, State> {
  state = {
    corrections: {},
  };

  componentDidMount() {
    this.listener = listen(this.handleMessage);
  }

  componentWillUnmount() {
    this.listener();
  }

  handleMessage = data => {
    if (data.action === 'show-correction') {
      const path = data.path || 'root';

      const newMessages = [
        ...(this.state.corrections[path] || []),
        { method: 'warn', data: [data.message] },
      ];

      this.setState({
        corrections: {
          ...this.state.corrections,
          [path]: newMessages,
        },
      });

      this.props.updateStatus('warning');
    } else if (data.action === 'show-error') {
      const path = data.path || 'root';

      const newMessages = [
        ...(this.state.corrections[path] || []),
        { method: 'error', data: [data.message] },
      ];

      this.setState({
        corrections: {
          ...this.state.corrections,
          [path]: newMessages,
        },
      });

      this.props.updateStatus('error');
    } else if (data.type === 'start') {
      this.setState({ corrections: [] });
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
        {files.map(file => {
          const splittedPath = file.split('/');
          const fileName = splittedPath.pop();

          return (
            <div key={file}>
              <File>
                <Path>{splittedPath.join('/')}/</Path>
                <FileName>{fileName}</FileName>
                <Actions>
                  <Tooltip title="Open File">
                    <FileIcon onClick={() => this.openFile(file)} />
                  </Tooltip>
                </Actions>
              </File>
              <Console
                logs={this.state.corrections[file]}
                variant="dark"
                styles={inspectorTheme}
              />
            </div>
          );
        })}
      </Container>
    );
  }
}

export default {
  title: 'Problems',
  Content: Problems,
  actions: [],
  show: (template: Template) => !getTemplate(template).isServer,
};

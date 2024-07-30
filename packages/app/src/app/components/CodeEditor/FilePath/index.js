import * as React from 'react';
import { getModulePath } from '@codesandbox/common/lib/sandbox/modules';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import EntryIcons from 'app/components/EntryIcons';
import { getType } from 'app/utils/get-type';

import { Container, Chevron, FileName, StyledExitZen } from './elements';

export default class FilePath extends React.Component {
  state = {
    hovering: false,
  };

  onMouseEnter = () => {
    this.setState({ hovering: true });
  };

  onMouseLeave = () => {
    this.setState({ hovering: false });
  };

  render() {
    const {
      currentModule,
      modules,
      directories,
      workspaceHidden,
      toggleWorkspace,
      exitZenMode,
    } = this.props;
    const path = getModulePath(modules, directories, currentModule.id);

    const pathParts = path.split('/');
    const fileName = pathParts.pop();
    const directoryPath = pathParts
      .join('/')
      .replace(/\/$/, '')
      .replace(/^\//, '');

    return (
      <Container
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <Chevron
          onClick={toggleWorkspace}
          workspacehidden={String(workspaceHidden)}
          hovering={String(!workspaceHidden || this.state.hovering)}
        />
        <FileName hovering={!workspaceHidden || this.state.hovering}>
          <EntryIcons
            isNotSynced={currentModule.isNotSynced}
            type={getType(currentModule.title)}
            error={currentModule.errors && currentModule.errors.length > 0}
          />
          <span style={{ marginLeft: '0.25rem' }}>{fileName}</span>
          <span
            style={{ marginLeft: '.75rem', color: 'rgba(255, 255, 255, 0.6)' }}
          >
            {directoryPath}
          </span>
        </FileName>

        <Tooltip content="Close Zen Mode" style={{ zIndex: 10 }}>
          <StyledExitZen onClick={exitZenMode} />
        </Tooltip>
      </Container>
    );
  }
}

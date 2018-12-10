import * as React from 'react';
import { getModulePath } from 'common/sandbox/modules';
import EntryIcons from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons';
import getType from 'app/utils/get-type';

import {
  Container,
  Chevron,
  FileName,
  StyledExitZen,
  FileNameContainer,
  Directory,
} from './elements';

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
        <FileNameContainer hovering={!workspaceHidden || this.state.hovering}>
          <EntryIcons
            isNotSynced={currentModule.isNotSynced}
            type={getType(currentModule.title)}
            error={currentModule.errors && currentModule.errors.length > 0}
          />
          <FileName>{fileName}</FileName>
          <Directory>{directoryPath}</Directory>
        </FileNameContainer>

        <StyledExitZen onClick={exitZenMode} />
      </Container>
    );
  }
}

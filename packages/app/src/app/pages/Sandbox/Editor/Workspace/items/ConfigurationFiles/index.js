import React, { Component } from 'react';

import { Description, WorkspaceSubtitle, EntryContainer } from '../../elements';

class ConfigurationFiles extends Component {
  render() {
    return (
      <div>
        <Description>
          CodeSandbox supports several config files per template, you can see
          and edit all supported files for the current sandbox here.
        </Description>

        <div>
          <WorkspaceSubtitle>Created Files</WorkspaceSubtitle>
          <EntryContainer>.prettierrc</EntryContainer>
        </div>

        <div>
          <WorkspaceSubtitle>Other Files</WorkspaceSubtitle>
        </div>
      </div>
    );
  }
}

export default ConfigurationFiles;

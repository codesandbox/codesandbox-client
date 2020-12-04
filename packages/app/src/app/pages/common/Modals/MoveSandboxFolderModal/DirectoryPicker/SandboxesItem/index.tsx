import React, { useState } from 'react';
import { useOvermind } from 'app/overmind';
import { withRouter } from 'react-router-dom';
import { DropTarget } from 'react-dnd';
import { Icon } from '@codesandbox/components';
import { Container } from './elements';
import { DropFolderEntry } from './FolderEntry';
import { CreateFolderEntry } from './FolderEntry/CreateFolderEntry';

import { entryTarget, collectTarget } from './folder-drop-target';

import getChildCollections from '../utils/get-child-collections';

import {
  CreateDirectoryContainer as FolderContainer,
  IconContainer as FolderIconContainer,
  AnimatedChevron as FolderChevron,
} from './FolderEntry/elements';

export interface SandboxesItemComponentProps {
  teamId: string | null;
  onSelect: (args: { path: string | null; teamId: string | null }) => void;
  currentPath: string | null;
  currentTeamId: string | null;
  connectDropTarget?: any;
}

const SandboxesItemComponent = ({
  onSelect,
  teamId,
  currentPath,
  connectDropTarget,
  currentTeamId,
}) => {
  const [creatingDirectory, setCreatingDirectory] = useState(false);
  const { state } = useOvermind();

  const basePath = teamId
    ? `/dashboard/teams/${teamId}/sandboxes`
    : '/dashboard/sandboxes';

  const { children, folders, foldersByPath } = getChildCollections(
    state.dashboard.allCollections
  );

  const disabledMessage =
    teamId == null
      ? "It's currently not possible to move sandboxes to 'All Sandboxes' in a personal workspace"
      : null;

  return connectDropTarget(
    <div>
      <Container>
        <FolderContainer
          active={currentPath === null && currentTeamId === teamId}
          onClick={() => {
            onSelect({ path: null, teamId });
          }}
        >
          <FolderIconContainer>
            <FolderChevron style={{ opacity: 0 }} />
            <Icon name="file" />
          </FolderIconContainer>
          Drafts
        </FolderContainer>

        <DropFolderEntry
          basePath={basePath}
          teamId={teamId}
          path="/"
          url="/"
          folders={folders}
          foldersByPath={foldersByPath}
          name="All Sandboxes"
          disabled={disabledMessage}
          open
          onSelect={onSelect}
          currentPath={currentPath}
          currentTeamId={currentTeamId}
        />

        {(creatingDirectory || children.size === 0) && (
          <CreateFolderEntry
            noFocus={!creatingDirectory}
            basePath=""
            depth={1}
            close={() => setCreatingDirectory(false)}
          />
        )}
      </Container>
    </div>
  );
};

export const SandboxesItem = (DropTarget(
  ['FOLDER'],
  entryTarget,
  collectTarget
  // @ts-ignore
)(withRouter(SandboxesItemComponent)) as unknown) as React.ComponentClass<
  SandboxesItemComponentProps
>;

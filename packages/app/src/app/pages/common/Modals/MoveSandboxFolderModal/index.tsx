import track from '@codesandbox/common/lib/utils/analytics';
import { basename } from 'path';
import ChevronRight from 'react-icons/lib/md/chevron-right';
import React, { FunctionComponent, useState } from 'react';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { Button, Stack, Element, Text } from '@codesandbox/components';
import { WorkspaceSelect } from 'app/components/WorkspaceSelect';
import { addSandboxesToFolder } from '../../../Dashboard/queries';

import { DirectoryPicker } from './DirectoryPicker';

export const MoveSandboxFolderModal: FunctionComponent = () => {
  const {
    actions: { modalClosed, refetchSandboxInfo },
    state: {
      activeTeamInfo,
      user,
      editor: { currentSandbox },
    },
  } = useOvermind();
  const { collection, id, team } = currentSandbox || {};
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState<string | null>(collection?.path || null);
  const [teamId, setTeamId] = useState(team?.id);

  const [selectedTeam, setSelectedTeam] = useState(
    activeTeamInfo
      ? {
          type: 'team' as const,
          id: team.id,
          name: activeTeamInfo.name,
          avatarUrl: activeTeamInfo.avatarUrl,
        }
      : {
          type: 'user' as const,
          id: user.id,
          username: user.username,
          avatarUrl: user.avatarUrl,
        }
  );

  const handleMove = () => {
    setLoading(true);
    setError(undefined);

    addSandboxesToFolder([id], path, teamId)
      .then(() => {
        refetchSandboxInfo();

        setLoading(false);
        modalClosed();

        track('Move Sandbox From Editor');
      })
      .catch(({ message }) => {
        setError(message);

        setLoading(false);
      });
  };

  const onSelect = ({ teamId: newTeamId, path: newPath }) => {
    setTeamId(newTeamId);
    setPath(newPath);
  };

  return (
    <Stack
      css={css({ width: '100%', paddingX: 6, paddingY: 7 })}
      gap={6}
      direction="vertical"
    >
      <Text size={6} weight="bold">
        Move to Folder
      </Text>
      <Stack gap={4} direction="vertical">
        <Element
          css={css({
            height: 10,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'sideBar.border',
          })}
        >
          <WorkspaceSelect
            onSelect={workspace => {
              setSelectedTeam(workspace);
              setTeamId(workspace.type === 'user' ? null : workspace.id);
            }}
            activeAccount={selectedTeam}
          />
        </Element>
        <Stack direction="vertical" gap={4}>
          <Element
            css={css({
              maxHeight: 400,
              overflow: 'auto',
              border: '1px solid',
              borderColor: 'sideBar.border',
              borderRadius: 4,
            })}
          >
            <DirectoryPicker
              currentPath={path}
              currentTeamId={teamId}
              onSelect={onSelect}
            />
          </Element>

          {error}

          <Stack align="flex-end" gap={2} justify="flex-end">
            <Button
              css={css({ width: 'auto' })}
              variant="secondary"
              onClick={modalClosed}
            >
              Cancel
            </Button>

            <Button
              css={css({ width: 'auto' })}
              disabled={loading}
              onClick={handleMove}
            >
              {loading ? (
                'Moving Sandbox...'
              ) : (
                <>
                  {`Move to ${
                    path === null ? 'Drafts' : basename(path) || 'All Sandboxes'
                  }`}

                  <ChevronRight />
                </>
              )}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

import track from '@codesandbox/common/lib/utils/analytics';
import { basename } from 'path';
import ChevronRight from 'react-icons/lib/md/chevron-right';
import React, { FunctionComponent, useState } from 'react';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import {
  Button,
  Stack,
  Element,
  Text,
  ThemeProvider,
} from '@codesandbox/components';
import { WorkspaceSelect } from 'app/components/WorkspaceSelect';
import Modal from 'app/components/Modal';
import { addSandboxesToFolder } from '../../../Dashboard/queries';

import { DirectoryPicker } from './DirectoryPicker';

export const MoveSandboxFolderModal: FunctionComponent = () => {
  const {
    actions: { refetchSandboxInfo, modals: modalsActions },
    state: { activeTeamInfo, activeTeam, user, modals },
  } = useOvermind();
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState<string | null>(
    modals.moveSandboxModal.defaultOpenedPath
  );
  const [teamId, setTeamId] = useState(activeTeam);

  const [selectedTeam, setSelectedTeam] = useState(
    activeTeamInfo
      ? {
          type: 'team' as const,
          id: activeTeamInfo.id,
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

    addSandboxesToFolder(modals.moveSandboxModal.sandboxIds, path, teamId)
      .then(() => {
        refetchSandboxInfo();

        setLoading(false);
        modalsActions.moveSandboxModal.close();

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
    <ThemeProvider>
      <Modal
        isOpen={modals.moveSandboxModal.isCurrent}
        onClose={() => modalsActions.moveSandboxModal.close()}
        width={480}
      >
        <Stack
          css={css({ width: '100%', paddingX: 6, paddingY: 7 })}
          gap={6}
          direction="vertical"
        >
          <Text size={6} weight="bold">
            Move {modals.moveSandboxModal.sandboxIds.length} items
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
                  onClick={modalsActions.moveSandboxModal.close}
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
                        path === null
                          ? 'Drafts'
                          : basename(path) || 'All Sandboxes'
                      }`}

                      <ChevronRight />
                    </>
                  )}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Modal>
    </ThemeProvider>
  );
};

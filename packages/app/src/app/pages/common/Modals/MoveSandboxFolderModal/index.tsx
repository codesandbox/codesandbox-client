import track from '@codesandbox/common/lib/utils/analytics';
import { basename } from 'path';
import ChevronRight from 'react-icons/lib/md/chevron-right';
import React, { FunctionComponent, useState } from 'react';
import css from '@styled-system/css';
import { useAppState, useActions } from 'app/overmind';
import {
  Button,
  Stack,
  Element,
  Text,
  ThemeProvider,
} from '@codesandbox/components';
import Modal from 'app/components/Modal';

import { DirectoryPicker } from './DirectoryPicker';

export const MoveSandboxFolderModal: FunctionComponent = () => {
  const { dashboard, refetchSandboxInfo, modals: modalsActions } = useActions();
  const { activeTeam, modals } = useAppState();
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState<string | null>(
    modals.moveSandboxModal.defaultOpenedPath
  );
  const [teamId, setTeamId] = useState(activeTeam);

  const handleMove = () => {
    setLoading(true);
    setError(undefined);

    dashboard
      .addSandboxesToFolder({
        sandboxIds: modals.moveSandboxModal.sandboxIds,
        collectionPath: path,
        teamId,
      })
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
          <Text size={6} weight="regular">
            Move {modals.moveSandboxModal.sandboxIds.length}{' '}
            {modals.moveSandboxModal.sandboxIds.length > 1 ? 'items' : 'item'}
          </Text>
          <Stack gap={4} direction="vertical">
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
                        path === null ? 'Drafts' : basename(path) || 'Sandboxes'
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

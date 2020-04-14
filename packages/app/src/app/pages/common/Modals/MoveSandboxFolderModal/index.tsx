import track from '@codesandbox/common/lib/utils/analytics';
import { basename } from 'path';
import ChevronRight from 'react-icons/lib/md/chevron-right';
import React, { FunctionComponent, useEffect, useState } from 'react';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { Button, Stack, Element } from '@codesandbox/components';
import { addSandboxesToFolder } from '../../../Dashboard/queries';

import { DirectoryPicker } from './DirectoryPicker';
import { Alert } from '../Common/Alert';

export const MoveSandboxFolderModal: FunctionComponent = () => {
  const {
    actions: { modalClosed, refetchSandboxInfo },
    state: {
      editor: { currentSandbox },
    },
  } = useOvermind();
  const { collection, id, team } = currentSandbox || {};
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState(collection?.path || '/');
  const [teamId, setTeamId] = useState(team?.id);

  const handleMove = () => {
    setLoading(true);
    setError(undefined);
  };

  const onSelect = ({ teamId: newTeamId, path: newPath }) => {
    setTeamId(newTeamId);
    setPath(newPath);
  };

  useEffect(() => {
    if (!loading) {
      return;
    }

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
  }, [id, loading, modalClosed, path, refetchSandboxInfo, teamId]);

  return (
    <Alert
      title="Move to Folder"
      css={css({
        paddingRight: 0,
        paddingLeft: 0,
        '> span': {
          paddingLeft: 4,
          paddingBottom: 4,
          borderBottom: '1px solid',
          borderColor: 'sideBar.border',
        },
      })}
    >
      <Element
        css={css({
          maxHeight: 400,
          overflow: 'auto',
        })}
      >
        <DirectoryPicker
          currentPath={path}
          currentTeamId={teamId}
          onSelect={onSelect}
        />
      </Element>

      {error}

      <Stack
        marginTop={4}
        align="flex-end"
        gap={2}
        justify="flex-end"
        css={css({
          paddingTop: 4,
          paddingRight: 4,
          borderTop: '1px solid',
          borderColor: 'sideBar.border',
        })}
      >
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
                path !== '/'
                  ? basename(path)
                  : `${teamId ? 'Our' : 'My'} Sandboxes`
              }`}

              <ChevronRight />
            </>
          )}
        </Button>
      </Stack>
    </Alert>
  );
};

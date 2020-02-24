import track from '@codesandbox/common/lib/utils/analytics';
import { basename } from 'path';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { useOvermind } from 'app/overmind';

import { addSandboxesToFolder } from '../../../Dashboard/queries';

import { DirectoryPicker } from './DirectoryPicker';
import {
  Block,
  Button,
  CancelButton,
  ChevronRight,
  Container,
} from './elements';

export const MoveSandboxFolderModal: FunctionComponent = () => {
  const {
    actions: { modalClosed, refetchSandboxInfo },
    state: {
      editor: {
        currentSandbox: { collection, id, team },
      },
    },
  } = useOvermind();
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
    <div>
      <Block>Move to Folder</Block>

      <Container>
        <DirectoryPicker
          currentPath={path}
          currentTeamId={teamId}
          onSelect={onSelect}
        />
      </Container>

      {error}

      <Block right>
        <CancelButton onClick={() => modalClosed()}>Cancel</CancelButton>

        <Button disabled={loading} onClick={handleMove} small>
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
      </Block>
    </div>
  );
};

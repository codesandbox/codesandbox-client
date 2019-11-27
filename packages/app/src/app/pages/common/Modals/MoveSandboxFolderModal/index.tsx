import React, { useState, useEffect, useCallback } from 'react';
import { useOvermind } from 'app/overmind';
import { basename } from 'path';
import track from '@codesandbox/common/lib/utils/analytics';
import { Button } from '@codesandbox/common/lib/components/Button';
import ChevronRight from 'react-icons/lib/md/chevron-right';

import DirectoryPicker from './DirectoryPicker';
import { Container } from '../elements';

import { Block, CancelButton } from './elements';
import { addSandboxesToFolder } from '../../../Dashboard/queries';

const MoveSandboxFolderModal = () => {
  const {
    state: {
      editor: { currentSandbox: sandbox },
    },
    actions: { refetchSandboxInfo, modalClosed },
  } = useOvermind();
  const { collection } = sandbox;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [teamId, setTeamId] = useState(
    sandbox.team ? sandbox.team.id || undefined : undefined
  );
  const [path, setPath] = useState(collection ? collection.path : '/');

  const onSelect = useCallback(({ teamId: newTeamId, path: newPath }) => {
    setTeamId(newTeamId);
    setPath(newPath);
  }, []);

  const handleMove = useCallback(() => {
    setLoading(true);
    setError(undefined);
  }, []);

  useEffect(() => {
    if (!loading) return;
    addSandboxesToFolder([sandbox.id], path, teamId)
      .then(() => {
        refetchSandboxInfo();

        setLoading(false);
        modalClosed();

        track('Move Sandbox From Editor');
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [loading, path, teamId, sandbox, refetchSandboxInfo, modalClosed]);

  return (
    <div>
      <Block>Move to Folder</Block>
      <Container style={{ maxHeight: 400, overflow: 'auto' }}>
        <DirectoryPicker
          onSelect={onSelect}
          currentTeamId={teamId}
          currentPath={path}
        />
      </Container>

      {error}

      <Block right>
        <CancelButton onClick={modalClosed}>Cancel</CancelButton>

        <Button
          onClick={handleMove}
          css="display: inline-flex; align-items: center"
          small
          disabled={loading}
        >
          {loading ? (
            'Moving Sandbox...'
          ) : (
            <>
              Move to{' '}
              {path !== '/'
                ? basename(path)
                : `${teamId ? 'Our' : 'My'} Sandboxes`}
              <ChevronRight
                style={{ marginRight: '-.25rem', marginLeft: '.25rem' }}
              />
            </>
          )}
        </Button>
      </Block>
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default MoveSandboxFolderModal;

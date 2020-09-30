import React from 'react';
import { Button } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';

export const SandboxDeletedConflict = ({ conflict }) => {
  const {
    state: {
      git: { conflictsResolving },
    },
    actions: {
      git: { addConflictedFile, deleteConflictedFile },
    },
  } = useOvermind();
  return (
    <>
      <Button
        css={css({ width: 'auto' })}
        type="button"
        variant="secondary"
        disabled={conflictsResolving.includes(conflict.filename)}
        onClick={() => {
          addConflictedFile(conflict);
        }}
      >
        Add file
      </Button>
      <Button
        css={css({ width: 'auto' })}
        variant="secondary"
        type="button"
        disabled={conflictsResolving.includes(conflict.filename)}
        onClick={() => deleteConflictedFile(conflict)}
      >
        Delete file
      </Button>
    </>
  );
};

export const SandboxModifiedConflict = ({ conflict }) => {
  const {
    actions: {
      git: { diffConflictedFile },
    },
  } = useOvermind();
  return (
    <Button
        css={css({ width: 'auto' })}
        type="button"
        variant="secondary"
        onClick={() => diffConflictedFile(conflict)}
      >
        Resolve by diff
      </Button>
  );
};

export const SandboxDeletedSourceModifiedConflict = ({ conflict }) => {
  const {
    state: {
      git: { conflictsResolving },
    },
    actions: {
      git: { ignoreConflict, addConflictedFile },
    },
  } = useOvermind();

  return (
    <>
      <Button
        css={css({ width: 'auto' })}
        type="button"
        variant="secondary"
        disabled={conflictsResolving.includes(conflict.filename)}
        onClick={() => addConflictedFile(conflict)}
      >
        Add file
      </Button>
      <Button
        css={css({ width: 'auto' })}
        variant="secondary"
        type="button"
        disabled={conflictsResolving.includes(conflict.filename)}
        onClick={() => ignoreConflict(conflict)}
      >
        Delete file
      </Button>
    </>
  );
};

export const BothModifiedConflict = ({ conflict }) => {
  const {
    actions: {
      git: { diffConflictedFile },
    },
  } = useOvermind();
  return (
    <Button
        css={css({ width: 'auto' })}
        type="button"
        variant="secondary"
        onClick={() => diffConflictedFile(conflict)}
      >
        Resolve by diff
      </Button>
  );
};

export const SourceDeletedConflict = ({ conflict }) => {
  const {
    state: {
      git: { conflictsResolving },
    },
    actions: {
      git: { ignoreConflict, deleteConflictedFile },
    },
  } = useOvermind();
  return (
    <>
      <Button
        css={css({ width: 'auto' })}
        type="button"
        variant="secondary"
        disabled={conflictsResolving.includes(conflict.filename)}
        onClick={() => {
          ignoreConflict(conflict);
        }}
      >
        Keep file
      </Button>
      <Button
        css={css({ width: 'auto' })}
        variant="secondary"
        type="button"
        disabled={conflictsResolving.includes(conflict.filename)}
        onClick={() => deleteConflictedFile(conflict)}
      >
        Delete file
      </Button>
    </>
  );
};

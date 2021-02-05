import React from 'react';
import { Button } from '@codesandbox/components';
import css from '@styled-system/css';
import { useAppState, useActions } from 'app/overmind';

export const SandboxDeletedConflict = ({ conflict }) => {
  const { addConflictedFile, deleteConflictedFile } = useActions().git;
  const { conflictsResolving } = useAppState().git;
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
  const { diffConflictedFile } = useActions().git;
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
  const { ignoreConflict, addConflictedFile } = useActions().git;
  const { conflictsResolving } = useAppState().git;

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
  const { diffConflictedFile } = useActions().git;
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
  const { conflictsResolving } = useAppState().git;
  const { ignoreConflict, deleteConflictedFile } = useActions().git;
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

import { useOvermind } from 'app/overmind';
import { json } from 'overmind';
import React from 'react';

export const Comments: React.FC = () => {
  const { state } = useOvermind();

  if (!state.editor.currentSandbox) {
    return null;
  }

  return (
    <textarea
      value={JSON.stringify(
        json(state.editor.comments[state.editor.currentSandbox.id]),
        null,
        2
      )}
    />
  );
};

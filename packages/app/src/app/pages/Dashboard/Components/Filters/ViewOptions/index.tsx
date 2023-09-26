import React, { FunctionComponent } from 'react';
import { useAppState, useActions } from 'app/overmind';
import { IconButton } from '@codesandbox/components';

export const ViewOptions: FunctionComponent = React.memo(() => {
  const {
    dashboard: { viewModeChanged },
  } = useActions();
  const {
    dashboard: { viewMode },
  } = useAppState();

  const oppositeViewMode = viewMode === 'grid' ? 'list' : 'grid';

  return (
    <IconButton
      variant="square"
      name={oppositeViewMode}
      size={16}
      title={`Switch to ${oppositeViewMode} view`}
      onClick={() => {
        viewModeChanged({ mode: oppositeViewMode });
      }}
    />
  );
});

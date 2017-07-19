import React from 'react';
import Tooltip from '../Tooltip';

export default ({ privacy }: { privacy: number }) => {
  if (privacy === 0) {
    return <Tooltip title="Everyone can see the sandbox">Public</Tooltip>;
  }

  if (privacy === 1) {
    return (
      <Tooltip title="Only users with the url can see the sandbox">
        Unlisted
      </Tooltip>
    );
  }

  if (privacy === 2) {
    return <Tooltip title="Only you can see the sandbox">Private</Tooltip>;
  }

  return null;
};

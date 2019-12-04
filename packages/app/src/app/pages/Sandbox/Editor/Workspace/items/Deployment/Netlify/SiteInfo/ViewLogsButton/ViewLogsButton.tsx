import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { Button } from './elements';

export const ViewLogsButton: FunctionComponent = () => {
  const {
    actions: { modalOpened },
  } = useOvermind();

  return (
    <Button onClick={() => modalOpened({ modal: 'netlifyLogs' })} small>
      View Logs
    </Button>
  );
};

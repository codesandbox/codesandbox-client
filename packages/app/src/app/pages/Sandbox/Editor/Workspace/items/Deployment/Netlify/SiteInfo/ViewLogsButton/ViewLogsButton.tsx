import React from 'react';

import { useSignals } from 'app/store';

import { Button } from './elements';

export const ViewLogsButton = () => {
  const { modalOpened } = useSignals();

  return (
    <Button onClick={() => modalOpened({ modal: 'netlifyLogs' })} small>
      View Logs
    </Button>
  );
};

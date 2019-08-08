import React from 'react';

import { inject } from 'app/componentConnectors';

import { Button } from './elements';

export const ViewLogsButton = inject('signals')(
  ({ signals: { modalOpened } }) => (
    <Button onClick={() => modalOpened({ modal: 'netlifyLogs' })} small>
      View Logs
    </Button>
  )
);

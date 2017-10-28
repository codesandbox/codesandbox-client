import React from 'react';

import ChevronRight from 'react-icons/lib/md/chevron-right';
import ChevronLeft from 'react-icons/lib/fa/angle-double-left';
import WarningIcon from 'react-icons/lib/md/warning';
import ErrorIcon from 'react-icons/lib/md/error';

export default ({ type, logType }: { type: string, logType: string }) => {
  if (type === 'command') {
    return <ChevronRight />;
  }

  if (type === 'return') {
    return <ChevronLeft />;
  }

  switch (logType) {
    case 'warning':
      return <WarningIcon />;
    case 'error':
      return <ErrorIcon />;
    default:
      return false;
  }
};

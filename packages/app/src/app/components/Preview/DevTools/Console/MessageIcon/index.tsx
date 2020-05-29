import React from 'react';
import { FaAngleDoubleLeft } from 'react-icons/fa';
import { MdChevronRight, MdError, MdWarning } from 'react-icons/md';

export function MessageIcon({ type, logType }) {
  if (type === 'command') {
    return <MdChevronRight />;
  }

  if (type === 'return') {
    return <FaAngleDoubleLeft />;
  }

  switch (logType) {
    case 'warning':
    case 'warn':
      return <MdWarning />;
    case 'error':
      return <MdError />;
    default:
      return false;
  }
}

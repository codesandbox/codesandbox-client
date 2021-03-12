import React from 'react';
// eslint-disable-next-line import/no-cycle
import { useTheme } from '../../components/layout';

const Docs = props => {
  const white = useTheme().homepage.white;
  return (
    <svg width={31} height={26} fill="none" viewBox="0 0 31 26" {...props}>
      <path
        fill={white}
        d="M14.857 26V3.935C14.857-1.95 0 .257 0 1.177v21.146c11.361 0 9.396 2.24 14.857 3.677zM15.715 26V3.935c0-5.884 14.857-3.678 14.857-2.758v21.146c-11.362 0-9.397 2.24-14.857 3.677z"
      />
    </svg>
  );
};

export default Docs;

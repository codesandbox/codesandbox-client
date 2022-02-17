import React from 'react';
// eslint-disable-next-line import/no-cycle
import { useTheme } from '../../components/layout';

const New = props => {
  const white = useTheme().homepage.white;
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M29.5 1.61475L35.4154 23.5846L57.3853 29.5L35.4154 35.4154L29.5 57.3853L23.5846 35.4154L1.61475 29.5L23.5846 23.5846L29.5 1.61475ZM26.8484 26.8484L17 29.5L26.8484 32.1517L29.5 42L32.1517 32.1517L42 29.5L32.1517 26.8484L29.5 17L26.8484 26.8484Z"
        fill={white}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.5 0L4.33327 4.33327L0 5.5L4.33327 6.66673L5.5 11L6.66673 6.66673L11 5.5L6.66673 4.33327L5.5 0Z"
        fill={white}
      />
    </svg>
  );
};

export default New;

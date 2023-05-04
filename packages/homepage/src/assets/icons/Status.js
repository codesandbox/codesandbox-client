import React from 'react';
// eslint-disable-next-line import/no-cycle
import { useTheme } from '../../components/layout';

const Status = props => {
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
      <path d="M12 11V49" stroke={white} strokeWidth="4" />
      <path d="M21 11V49" stroke={white} strokeWidth="4" />
      <path opacity="0.4" d="M30 11V49" stroke={white} strokeWidth="4" />
      <path d="M39 11V49" stroke={white} strokeWidth="4" />
      <path d="M48 11V49" stroke={white} strokeWidth="4" />
    </svg>
  );
};

export default Status;

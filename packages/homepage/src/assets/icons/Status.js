import React from 'react';
// eslint-disable-next-line import/no-cycle
import { useTheme } from '../../components/layout';

const Status = props => {
  const white = useTheme().homepage.white;
  return (
    <svg width={33} height={25} fill="none" viewBox="0 0 33 25" {...props}>
      <path fill={white} d="M0 0H3.846V25H0z" />
      <path fill={white} d="M5.77 0H9.616V25H5.77z" />
      <path fill={white} d="M11.539 0H15.385V25H11.539z" />
      <path fill={white} fillOpacity={0.46} d="M17.308 0H21.154V25H17.308z" />
      <path fill={white} d="M23.079 0H26.925V25H23.079z" />
      <path fill={white} d="M28.848 0H32.694V25H28.848z" />
    </svg>
  );
};

export default Status;

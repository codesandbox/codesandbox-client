import React from 'react';
import { useTheme } from '../../components/layout';

const Jobs = props => {
  const white = useTheme().homepage.white;
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15 18L29.4231 18L45 18V36H15V18Z"
        stroke={white}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M8 42.5H52" stroke={white} strokeWidth="5" />
    </svg>
  );
};

export default Jobs;

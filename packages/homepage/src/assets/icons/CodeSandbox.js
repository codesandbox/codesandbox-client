import React from 'react';
import { useTheme } from '../../components/layout';

const CodeSandbox = props => {
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
      <rect
        x="13"
        y="13"
        width="34"
        height="34"
        stroke={white}
        strokeWidth="4"
      />
    </svg>
  );
};
export default CodeSandbox;

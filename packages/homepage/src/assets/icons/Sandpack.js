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
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M46.1165 17.0859H32.0065V49.3123H46.1165V17.0859ZM28.123 13.2187V53.1795H50V13.2187H28.123Z"
        fill={white}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.9935 9.86717H13.8835V42.0936H27.9935V9.86717ZM10 6V45.9608H31.877V6H10Z"
        fill={white}
      />
    </svg>
  );
};
export default CodeSandbox;

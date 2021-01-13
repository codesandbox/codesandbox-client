import React from 'react';
import { useTheme } from '../../components/layout';

const Prototype = props => {
  const white = useTheme().homepage.white;
  return (
    <svg
      width={40}
      height={35}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx={33.75} cy={6.25} r={6.25} fill={white} />
      <path
        d="M9.836 3.886l12.472 12.472-17.037 4.565L9.836 3.886zM25.133 19.5l12.074 3.235-3.235 12.074-12.074-3.235z"
        fill={white}
      />
    </svg>
  );
};
export default Prototype;

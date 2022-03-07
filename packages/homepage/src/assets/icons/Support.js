import React from 'react';
// eslint-disable-next-line import/no-cycle
import { useTheme } from '../../components/layout';

const Support = props => {
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
      <circle cx="30" cy="30" r="22" stroke={white} strokeWidth="4" />
      <path
        d="M25 25C25 22.2386 27.2386 20 30 20C32.7614 20 35 22.2386 35 25C35 25.9954 34.7091 26.9228 34.2078 27.702C32.7135 30.0242 30 32.2386 30 35V35"
        stroke={white}
        strokeWidth="4"
      />
      <rect x="28" y="38" width="4" height="4" fill={white} />
    </svg>
  );
};

export default Support;

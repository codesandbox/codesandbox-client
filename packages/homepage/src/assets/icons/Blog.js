import React from 'react';
// eslint-disable-next-line import/no-cycle
import { useTheme } from '../../components/layout';

const Blog = props => {
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
      <path d="M30.1362 24.9318V7.11365" stroke={white} strokeWidth="4" />
      <circle
        cx="30.1363"
        cy="26.2727"
        r="2"
        stroke={white}
        strokeWidth="2.68182"
      />
      <path
        d="M32.0968 8L43.5248 27.897L38.1027 42.4205H22.1699L16.7478 27.897L28.1758 8H32.0968Z"
        stroke={white}
        strokeWidth="4"
      />
      <path
        d="M43.5 57V50.2046C43.5 49.6523 43.0523 49.2046 42.5 49.2046H17.7727C17.2204 49.2046 16.7727 49.6523 16.7727 50.2046V57"
        stroke={white}
        strokeWidth="4"
      />
    </svg>
  );
};

export default Blog;

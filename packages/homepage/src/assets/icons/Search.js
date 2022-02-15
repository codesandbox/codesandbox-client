import React from 'react';
// eslint-disable-next-line import/no-cycle
import { useTheme } from '../../components/layout';

const Search = props => {
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
        d="M36.6984 36.6984L48.7917 48.7917"
        stroke={white}
        strokeWidth="4"
      />
      <circle
        cx="26.1167"
        cy="26.1167"
        r="15.1167"
        stroke={white}
        strokeWidth="4"
      />
    </svg>
  );
};

export default Search;

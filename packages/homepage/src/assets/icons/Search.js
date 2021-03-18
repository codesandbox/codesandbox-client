import React from 'react';
// eslint-disable-next-line import/no-cycle
import { useTheme } from '../../components/layout';

const Search = props => {
  const white = useTheme().homepage.white;
  return (
    <svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill={white}
        fillRule="evenodd"
        d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm-.552-18a5.448 5.448 0 102.884 10.072l3.428 3.668L19.5 18l-3.428-3.668A5.448 5.448 0 0011.449 6zM8.46 11.448a2.988 2.988 0 115.977 0 2.988 2.988 0 01-5.977 0z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default Search;

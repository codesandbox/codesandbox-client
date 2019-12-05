import React from 'react';
import { useTheme } from '../../components/layout';

const Terminal = props => {
  const white = useTheme().homepage.white;
  return (
    <svg width={50} height={39} fill="none" viewBox="0 0 50 39" {...props}>
      <path
        fill={white}
        fillRule="evenodd"
        d="M0 2a2 2 0 012-2h46a2 2 0 012 2v34.095a2 2 0 01-2 2H2a2 2 0 01-2-2V2zm14.7 12.797L7.347 7.445l3.367-3.367 9.035 9.036 1.684 1.683-1.684 1.684-9.035 9.035-3.367-3.367 7.351-7.352zm4.347 12.393h16.667V22.43H19.047v4.762z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default Terminal;

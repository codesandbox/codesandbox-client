import React from 'react';
import { useTheme } from 'styled-components';

const Embed = props => {
  const white = useTheme().homepage.white;
  return (
    <svg width={34} height={25} fill="none" viewBox="0 0 34 25" {...props}>
      <path fill={white} d="M0 2a2 2 0 012-2h13.79v25H2a2 2 0 01-2-2V2z" />
      <path
        fill={white}
        fillOpacity={0.4}
        d="M33.24 2a2 2 0 00-2-2H16.62v24.93h14.62a2 2 0 002-2V2z"
      />
    </svg>
  );
};
export default Embed;

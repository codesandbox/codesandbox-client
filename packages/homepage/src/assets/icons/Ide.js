import React from 'react';
// eslint-disable-next-line import/no-cycle
import { useTheme } from '../../components/layout';

const IDE = props => {
  const white = useTheme().homepage.white;

  return (
    <svg width={32} height={32} fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill={white}
        fillRule="evenodd"
        d="M4.0702 4C3.47914 4 3 4.47914 3 5.0702V18.9298C3 19.5209 3.47914 20 4.0702 20H19.9298C20.5209 20 21 19.5209 21 18.9298V5.0702C21 4.47914 20.5209 4 19.9298 4H4.0702ZM5 11.9091L9.35634 7L10.4454 8.22727L7.17814 11.9091L10.4454 15.5909L9.35632 16.8182L5 11.9091ZM18.3333 11.9091L13.977 16.8182L12.8879 15.5909L16.1552 11.9091L12.8879 8.22728L13.977 7.00002L18.3333 11.9091Z"
      />
    </svg>
  );
};
export default IDE;

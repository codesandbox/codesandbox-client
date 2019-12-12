import React from 'react';
import { useTheme } from '../../components/layout';

const Learn = props => {
  const white = useTheme().homepage.white;
  return (
    <svg width={42} height={23} fill="none" viewBox="0 0 42 23" {...props}>
      <path
        fill={white}
        fillRule="evenodd"
        d="M.483 6.073L20.524.057c.255-.076.526-.076.78 0l20.04 6.016c.645.193.645 1.105 0 1.299L21.11 13.446a.678.678 0 01-.39 0L.483 7.372c-.644-.194-.644-1.106 0-1.3zm36.58 3.886l-1.215.369v3.721c-.314.143-.397.455-.397 1.089 0 .99.201 1.793 1.171 1.793s1.171-.803 1.171-1.793c0-.762-.119-1.059-.616-1.155V9.959h-.114zm-16.392 4.83L7.62 10.858v7.81c0 .565.35 1.071.884 1.26C10.896 20.77 17.557 23 21.236 23c3.663 0 9.86-2.21 12.115-3.062.518-.195.852-.692.852-1.246v-7.865l-13.054 3.961a.827.827 0 01-.478 0z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default Learn;

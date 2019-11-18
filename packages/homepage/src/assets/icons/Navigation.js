import React from 'react';

const Navigation = props => (
  <svg width={32} height={32} fill="none" viewBox="0 0 32 32" {...props}>
    <rect
      width={32}
      height={32}
      fill={props.active ? '#fff' : '#242424'}
      rx={4}
    />
    <path
      fill="#757575"
      d="M12.734 16L22 7.286 20.633 6 10 16l10.633 10L22 24.636 12.734 16z"
    />
  </svg>
);

export default Navigation;

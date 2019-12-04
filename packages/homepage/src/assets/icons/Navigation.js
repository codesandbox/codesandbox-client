import React from 'react';
import { useTheme } from '../../components/layout';

const Navigation = props => {
  const { white, grey, whiteDark, greyLight } = useTheme().homepage;

  const getFill = () => {
    if (props.light) {
      return props.active ? greyLight : whiteDark;
    }
    return props.active ? white : grey;
  };

  return (
    <svg width={32} height={32} fill="none" viewBox="0 0 32 32" {...props}>
      <rect width={32} height={32} fill={getFill(props)} rx={4} />
      <path
        fill={props.light && props.active ? white : greyLight}
        d="M12.734 16L22 7.286 20.633 6 10 16l10.633 10L22 24.636 12.734 16z"
      />
    </svg>
  );
};

export default Navigation;

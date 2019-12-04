import React from 'react';
import { useTheme } from '../../components/layout';

const Heart = props => {
  const white = useTheme().homepage.white;
  return (
    <svg width={41} height={39} fill="none" viewBox="0 0 41 39" {...props}>
      <path
        fill={white}
        d="M20.213 38.058c35.899-20.383 18.145-48.121 0-34.382-17.361-13.74-35.115 13.999 0 34.382z"
      />
    </svg>
  );
};

export default Heart;

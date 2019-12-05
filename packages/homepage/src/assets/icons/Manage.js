import React from 'react';
import { useTheme } from '../../components/layout';

const Manage = props => {
  const white = useTheme().homepage.white;
  return (
    <svg width={34} height={38} fill="none" viewBox="0 0 34 38" {...props}>
      <path
        fill={white}
        fillRule="evenodd"
        d="M16.544 17.588a.906.906 0 00.894-.002l14.182-8.11a.888.888 0 00-.007-1.55L17.83.192a1.51 1.51 0 00-1.47 0L2.379 8.036a.888.888 0 00-.003 1.552l14.168 8zm-1.551 3.628a.89.89 0 00-.441-.767L1.358 12.693C.758 12.34 0 12.769 0 13.46v15.492c0 .514.007 1.085.465 1.341l13.177 7.585c.6.345 1.35-.084 1.35-.771v-15.89zm3.998.174a.89.89 0 01.434-.763l13.193-7.914c.6-.36 1.365.068 1.365.763v15.429c0 .505-.118.973-.55 1.225L20.35 37.853c-.6.354-1.36-.074-1.36-.766V21.39z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default Manage;

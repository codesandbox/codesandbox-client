import React from 'react';
// eslint-disable-next-line import/no-cycle
import { useTheme } from '../../components/layout';

const Highlighted = props => {
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
        d="M31.4021 15.382L29.5 9.52786L27.5979 15.382L24.7915 24.0193L15.7097 24.0193L9.55431 24.0193L14.5341 27.6373L21.8814 32.9754L19.075 41.6127L17.1729 47.4668L22.1527 43.8488L29.5 38.5106L36.8473 43.8488L41.8271 47.4668L39.925 41.6127L37.1186 32.9754L44.4659 27.6373L49.4457 24.0193L43.2903 24.0193L34.2085 24.0193L31.4021 15.382Z"
        stroke={white}
        strokeWidth="4"
      />
    </svg>
  );
};

export default Highlighted;

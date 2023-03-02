import React from 'react';
import { useTheme } from '../../components/layout';

const Feedback = props => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M53 23H23V47.4286H44.6001L53 55.8284V23ZM49 27V46.1716L46.257 43.4286H27V27H49Z"
        fill="url(#paint0_linear_20_7)"
      />
      <path d="M10 11H44V37.7143H17.2857L10 45V11Z" fill="#151515" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 9H46V39.7143H18.1141L8 49.8284V9ZM12 13V40.1716L16.4573 35.7143H42V13H12Z"
        fill={white}
      />
      <defs>
        <linearGradient
          id="paint0_linear_20_7"
          x1="46"
          y1="33.5"
          x2="25"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={white} />
          <stop offset="1" stopColor={white} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};
export default Feedback;

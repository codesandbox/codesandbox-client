import React from 'react';
// eslint-disable-next-line import/no-cycle
import { useTheme } from '../../components/layout';

const Pricing = props => {
  const white = useTheme().homepage.white;
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="30" cy="30" r="22" stroke={white} strokeWidth="4" />
      <path
        d="M36.968 33.912C36.968 31.104 35.288 29.64 32.24 28.8L29.984 28.176C27.752 27.552 26.408 27.144 26.408 25.632C26.408 24.168 27.776 23.064 29.84 23.064C31.832 23.064 33.224 24.048 33.632 25.824H36.752C36.368 23.208 34.496 21.336 31.496 20.856V18H28.592V20.832C25.52 21.24 23.36 23.232 23.36 25.92C23.36 28.776 25.448 30.024 28.16 30.744L30.416 31.32C32.84 31.968 33.896 32.712 33.896 34.224C33.896 36.072 32.504 37.224 30.104 37.224C27.92 37.224 26.384 35.904 26.12 33.696H23C23.36 36.792 25.52 38.928 28.592 39.432V42.408H31.496V39.456C34.856 39 36.968 36.912 36.968 33.912Z"
        fill={white}
      />
    </svg>
  );
};

export default Pricing;

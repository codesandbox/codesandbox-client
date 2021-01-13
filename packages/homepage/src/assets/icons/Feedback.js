import React from 'react';
import { useTheme } from '../../components/layout';

const Feedback = props => {
  const white = useTheme().homepage.white;
  return (
    <svg
      width={42}
      height={29}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 12.201v-.143C0 5.398 5.398 0 12.058 0s12.058 5.398 12.058 12.058-5.399 12.058-12.058 12.058H0V12.2z"
        fill={white}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.19 23.003a14.22 14.22 0 005.124-10.945c0-1.485-.227-2.916-.648-4.262a10.914 10.914 0 015.028-1.219c6.054 0 10.962 4.908 10.962 10.962 0 .104-.002.207-.005.31v10.652H30.69a10.957 10.957 0 01-9.5-5.498z"
        fill={white}
      />
    </svg>
  );
};
export default Feedback;

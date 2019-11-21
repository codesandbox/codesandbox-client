import React from 'react';

const getFill = props => {
  if (props.light) {
    return props.active ? '#757575' : '#e6e6e6';
  }
  return props.active ? '#fff' : '#242424';
};

const PreviewMode = props => (
  <svg width={32} height={32} fill="none" viewBox="0 0 32 32" {...props}>
    <rect width={32} height={32} fill={getFill(props)} rx={4} />
    <path
      fill={props.light && props.active ? '#fff' : '#757575'}
      fillRule="evenodd"
      d="M22.163 9h-5.988v1.188h4.83L10.188 21.005v-5.16H9v6.843h7.175V21.5h-4.804l10.792-10.79v5.133h1.187V9h-1.187z"
      clipRule="evenodd"
    />
  </svg>
);

export default PreviewMode;

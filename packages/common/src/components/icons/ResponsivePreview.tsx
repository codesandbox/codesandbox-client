import React from 'react';
import IconBase from 'react-icons/IconBase';

export const ResponsivePreview = props => (
  <IconBase fill="none" viewBox="0 0 24 24" {...props}>
    <path
      fill={props.active ? '#E6E6E6' : '#757575'}
      fillRule="evenodd"
      d="M10.25 6a1 1 0 011-1h8a1 1 0 011 1v11.333a1 1 0 01-1 1h-5.754a.996.996 0 00.004-.083v-8.5a1 1 0 00-1-1h-2.25V6zM6.5 9.5a.5.5 0 00-.5.5v9.5a.5.5 0 00.5.5h5.75a.5.5 0 00.5-.5V10a.5.5 0 00-.5-.5H6.5z"
      clipRule="evenodd"
    />
  </IconBase>
);

import React from 'react';
import { EntryIcons } from 'app/components/EntryIcons';
// eslint-disable-next-line import/extensions
import { getType } from 'app/utils/get-type.ts';

export const Directory = props => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15.6674 9.70666L15.8096 9.83333H16H26C26.2761 9.83333 26.5 10.0572 26.5 10.3333V25C26.5 25.2761 26.2761 25.5 26 25.5H6C5.72386 25.5 5.5 25.2761 5.5 25V8C5.5 7.72386 5.72386 7.5 6 7.5H13.0001C13.1228 7.5 13.2411 7.54508 13.3327 7.62667L15.6674 9.70666Z"
      fill="#64D2FF"
      stroke="#64D2FF"
    />
  </svg>
);

export const File = props => {
  const type = getType(props.title);
  return <EntryIcons type={type} />;
};

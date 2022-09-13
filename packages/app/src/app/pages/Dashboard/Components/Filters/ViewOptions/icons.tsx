import React from 'react';

export const GridIcon = props => (
  <svg width={15} height={14} fill="none" viewBox="0 0 15 14" {...props}>
    <path
      d="M2.6665 2.66663H6.6665V6.66663H2.6665V2.66663Z"
      stroke={props.active ? '#fff' : '#757575'}
      fillOpacity="0"
      strokeLinejoin="round"
    />
    <path
      d="M9.33317 2.66663H13.3332V6.66663H9.33317V2.66663Z"
      stroke={props.active ? '#fff' : '#757575'}
      fillOpacity="0"
      strokeLinejoin="round"
    />
    <path
      d="M9.33317 9.33329H13.3332V13.3333H9.33317V9.33329Z"
      stroke={props.active ? '#fff' : '#757575'}
      fillOpacity="0"
      strokeLinejoin="round"
    />
    <path
      d="M2.6665 9.33329H6.6665V13.3333H2.6665V9.33329Z"
      stroke={props.active ? '#fff' : '#757575'}
      fillOpacity="0"
      strokeLinejoin="round"
    />
  </svg>
);

export const ListIcon = props => (
  <svg width={15} height={15} fill="none" viewBox="0 0 10 10" {...props}>
    <path
      d="M2 3.5C1.72386 3.5 1.5 3.72386 1.5 4C1.5 4.27614 1.72386 4.5 2 4.5V3.5ZM14 4.5C14.2761 4.5 14.5 4.27614 14.5 4C14.5 3.72386 14.2761 3.5 14 3.5V4.5ZM2 7.5C1.72386 7.5 1.5 7.72386 1.5 8C1.5 8.27614 1.72386 8.5 2 8.5V7.5ZM14 8.5C14.2761 8.5 14.5 8.27614 14.5 8C14.5 7.72386 14.2761 7.5 14 7.5V8.5ZM2 11.5C1.72386 11.5 1.5 11.7239 1.5 12C1.5 12.2761 1.72386 12.5 2 12.5V11.5ZM14 12.5C14.2761 12.5 14.5 12.2761 14.5 12C14.5 11.7239 14.2761 11.5 14 11.5V12.5ZM2 4.5H14V3.5H2V4.5ZM2 8.5H14V7.5H2V8.5ZM2 12.5H14V11.5H2V12.5Z"
      fill={props.active ? '#fff' : '#757575'}
    />
  </svg>
);

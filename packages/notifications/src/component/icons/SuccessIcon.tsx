import * as React from 'react';

type Props = {
  style?: React.CSSProperties;
};

export function SuccessIcon(props: Props) {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 16 16" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.673 3.30011C15.8757 3.48773 15.8878 3.80408 15.7002 4.0067L7.36688 13.0067C7.27422 13.1068 7.1447 13.1647 7.00833 13.1669C6.87196 13.1692 6.74058 13.1157 6.64464 13.0187L1.64464 7.96709C1.45038 7.77083 1.452 7.45425 1.64827 7.25999C1.84453 7.06574 2.16111 7.06736 2.35537 7.26363L6.98796 11.9441L14.9665 3.32729C15.1541 3.12467 15.4704 3.1125 15.673 3.30011Z"
        fill="currentColor"
      />
    </svg>
  );
}

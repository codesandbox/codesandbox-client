import * as React from 'react';

export default ({ width = 32, height = 32, className }) => (
  <svg
    width={width}
    height={height}
    className={className}
    viewBox="0 0 28 28"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Page-1" fill="none" fillRule="evenodd">
      <g id="logo" fillRule="nonzero">
        <g id="Group">
          <g fill="#FFF" id="Shape">
            <path
              d="M22,11 L15,11 L15,13 L19.8,13 C19.1,16 16.9,18.5 14,19.5 L2.5,8 C3.7,4.5 7.1,2 11,2 C14,2 16.7,3.5 18.4,5.8 L19.9,4.5 C17.9,1.8 14.7,0 11,0 C5.8,0 1.4,3.7 0.3,8.6 L13.5,21.8 C18.3,20.6 22,16.2 22,11 Z"
              transform="translate(3 3)"
            />
            <path
              d="M0,11.1 C0,13.9 1.1,16.6 3.2,18.7 C5.3,20.8 8.1,21.9 10.8,21.9 L0,11.1 Z"
              transform="translate(3 3)"
            />
          </g>
          <path
            d="M14,0 C6.3,0 0,6.3 0,14 C0,21.7 6.3,28 14,28 C21.7,28 28,21.7 28,14 C28,6.3 21.7,0 14,0 Z M6.2,21.8 C4.1,19.7 3,16.9 3,14.2 L13.9,25 C11.1,24.9 8.3,23.9 6.2,21.8 Z M16.4,24.7 L3.3,11.6 C4.4,6.7 8.8,3 14,3 C17.7,3 20.9,4.8 22.9,7.5 L21.4,8.8 C19.7,6.5 17,5 14,5 C10.1,5 6.8,7.5 5.5,11 L17,22.5 C19.9,21.5 22.1,19 22.8,16 L18,16 L18,14 L25,14 C25,19.2 21.3,23.6 16.4,24.7 Z"
            id="Shape"
            fill="#639"
          />
        </g>
      </g>
    </g>
  </svg>
);

import React from "react";
// eslint-disable-next-line import/no-cycle
import { useTheme } from "../../components/layout";

const Docs = (props) => {
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
      <g clip-path="url(#clip0_9_83)">
        <path
          d="M13 18H30.3333L39 26.5V52H13V18Z"
          stroke={white}
          stroke-width="4"
          stroke-linecap="round"
        />
        <g filter="url(#filter0_d_9_83)">
          <path d="M21 10H37.6667L46 18.5V44H21V10Z" fill="#151515" />
          <path
            d="M21 10H37.6667L46 18.5V44H21V10Z"
            stroke={white}
            stroke-width="4"
            stroke-linecap="round"
          />
        </g>
        <path
          d="M36 10V20H46"
          stroke={white}
          stroke-width="4"
          stroke-linecap="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_9_83"
          x="-13"
          y="-22"
          width="89"
          height="98"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-2" />
          <feGaussianBlur stdDeviation="15" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_9_83"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_9_83"
            result="shape"
          />
        </filter>
        <clipPath id="clip0_9_83">
          <rect width="60" height="60" fill={white} />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Docs;

import React from "react";
import { useTheme } from "../../components/layout";

const Feedback = (props) => {
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
      <g clip-path="url(#clip0_9_70)">
        <rect width="60" height="60" fill="#151515" />
        <path
          d="M51 25H25V45.4286H45.4286L51 51V25Z"
          fill="#151515"
          stroke={white}
          stroke-width="4"
          stroke-linecap="round"
        />
        <g filter="url(#filter0_d_9_70)">
          <path d="M10 11H44V37.7143H17.2857L10 45V11Z" fill="#151515" />
          <path
            d="M10 11H44V37.7143H17.2857L10 45V11Z"
            stroke={white}
            stroke-width="4"
            stroke-linecap="round"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_9_70"
          x="-21"
          y="-20"
          width="100"
          height="102.828"
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
          <feOffset dx="2" dy="2" />
          <feGaussianBlur stdDeviation="15.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_9_70"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_9_70"
            result="shape"
          />
        </filter>
        <clipPath id="clip0_9_70">
          <rect width="60" height="60" fill={white} />
        </clipPath>
      </defs>
    </svg>
  );
};
export default Feedback;

import React from 'react';
import { SVGIcon, ISVGIconProps } from './SVGIcon';

export const NextIcon: React.FC<ISVGIconProps> = ({ ...props }) => (
  <SVGIcon {...props}>
    <g clipPath="url(#clip0_1_2)">
      <mask
        id="mask0_1_2"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="32"
        height="32"
      >
        <path
          d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
          fill="black"
        />
      </mask>
      <g mask="url(#mask0_1_2)">
        <path
          d="M16 31.4667C24.542 31.4667 31.4667 24.542 31.4667 16C31.4667 7.458 24.542 0.53334 16 0.53334C7.458 0.53334 0.53334 7.458 0.53334 16C0.53334 24.542 7.458 31.4667 16 31.4667Z"
          fill="black"
          stroke="white"
          strokeWidth="2"
        />
        <path
          d="M26.5792 28.0036L12.2919 9.60001H9.60001V22.3947H11.7535V12.3349L24.8887 29.3058C25.4814 28.9092 26.046 28.4738 26.5792 28.0036Z"
          fill="url(#paint0_linear_1_2)"
        />
        <path
          d="M22.5778 9.60001H20.4445V22.4H22.5778V9.60001Z"
          fill="url(#paint1_linear_1_2)"
        />
      </g>
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_1_2"
        x1="19.3778"
        y1="20.7111"
        x2="25.6889"
        y2="28.5333"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_1_2"
        x1="21.5111"
        y1="9.60001"
        x2="21.4754"
        y2="19"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <clipPath id="clip0_1_2">
        <rect width="32" height="32" fill="white" />
      </clipPath>
    </defs>
  </SVGIcon>
);

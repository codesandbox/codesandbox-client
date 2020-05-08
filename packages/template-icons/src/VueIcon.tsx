import React from 'react';
import { SVGIcon, ISVGIconProps } from './SVGIcon';

export const VueIcon: React.FC<ISVGIconProps> = ({ ...props }) => (
  <SVGIcon {...props}>
    <path
      d="M25.6 2.1875H32L16 29.7875L0 2.1875H6.32H12.24L16 8.5875L19.68 2.1875H25.6Z"
      fill="#41B883"
    />
    <path
      d="M0 2.1875L16 29.7875L32 2.1875H25.6L16 18.7475L6.32 2.1875H0Z"
      fill="#41B883"
    />
    <path
      d="M6.32 2.1875L16 18.8275L25.6 2.1875H19.68L16 8.5875L12.24 2.1875H6.32Z"
      fill="#35495E"
    />
  </SVGIcon>
);

export const VueIconDark: React.FC<ISVGIconProps> = ({ ...props }) => (
  <SVGIcon {...props}>
    <path
      d="M2 4.91406L16 29.0641L30 4.91406H24.4L16 19.4041L7.53 4.91406H2Z"
      fill="black"
    />
    <path
      d="M7.53 3.91406L16 18.4741L24.4 3.91406H19.22L16 9.5141L12.71 3.91406H7.53Z"
      fill="black"
      fillOpacity="0.6"
    />
  </SVGIcon>
);

export const VueIconLight: React.FC<ISVGIconProps> = ({ ...props }) => (
  <SVGIcon {...props}>
    <path
      d="M2 4.91406L16 29.0641L30 4.91406H24.4L16 19.4041L7.53 4.91406H2Z"
      fill="white"
    />
    <path
      d="M7.53 3.91406L16 18.4741L24.4 3.91406H19.22L16 9.5141L12.71 3.91406H7.53Z"
      fill="white"
    />
  </SVGIcon>
);

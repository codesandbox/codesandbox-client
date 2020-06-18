import React from 'react';
import { SVGIcon, ISVGIconProps } from './SVGIcon';

export const MDXDeckIcon: React.FC<ISVGIconProps> = ({ ...props }) => (
  <SVGIcon {...props}>
    <path
      d="M30.7826 9.56522H1.21739C0.641093 9.56522 0.173912 10.0324 0.173912 10.6087V21.3913C0.173912 21.9676 0.641093 22.4348 1.21739 22.4348H30.7826C31.3589 22.4348 31.8261 21.9676 31.8261 21.3913V10.6087C31.8261 10.0324 31.3589 9.56522 30.7826 9.56522Z"
      fill="white"
      stroke="#EAEAEA"
      strokeWidth="0.347826"
    />
    <path
      d="M16.3478 17.7391V12.5997"
      stroke="black"
      strokeWidth="1.3913"
      strokeLinecap="square"
    />
    <path
      d="M13.2174 15.7078L16.3733 18.8638L19.4843 15.7533"
      stroke="black"
      strokeWidth="1.3913"
    />
    <path
      d="M3.81449 19.5775V13.7888L7.02609 17.0006L10.2567 13.7702V19.536"
      stroke="black"
      strokeWidth="1.3913"
    />
    <path
      d="M21.6953 18.9607L28.4823 12.1739M28.3917 18.9607L21.6046 12.1739L28.3917 18.9607Z"
      stroke="#F9AC00"
      strokeWidth="1.3913"
    />
  </SVGIcon>
);

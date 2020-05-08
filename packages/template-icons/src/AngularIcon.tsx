import React from 'react';
import { SVGIcon, ISVGIconProps } from './SVGIcon';

export const AngularIcon: React.FC<ISVGIconProps> = ({ ...props }) => (
  <SVGIcon {...props}>
    <path
      d="M16 3.84003L4.08321 8.08963L5.90081 23.8464L16 29.44L26.0992 23.8464L27.9168 8.08963L16 3.84003Z"
      fill="#DD0031"
    />
    <path
      d="M16 3.84003V6.68163V6.66883V19.6352V29.44L26.0992 23.8464L27.9168 8.08963L16 3.84003Z"
      fill="#C3002F"
    />
    <path
      d="M16 6.66882L8.5504 23.3728H11.328L12.8256 19.6352H19.1488L20.6464 23.3728H23.424L16 6.66882ZM18.176 17.3312H13.824L16 12.096L18.176 17.3312Z"
      fill="white"
    />
  </SVGIcon>
);

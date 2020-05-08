import React from 'react';
import { SVGIcon, ISVGIconProps } from './SVGIcon';

export const AdonisIcon: React.FC<ISVGIconProps> = ({ ...props }) => (
  <SVGIcon {...props}>
    <path
      d="M28 32H4C1.7909 32 0 30.2091 0 28V4C0 1.7909 1.7909 0 4 0H28C30.2091 0 32 1.7909 32 4V28C32 30.2091 30.2091 32 28 32Z"
      fill="#241651"
    />
    <path
      d="M28 26.6663H6.6664L17.333 5.33301L28 26.6663ZM8.8241 25.3333H25.8423L17.333 8.31471L8.8241 25.3333Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 6.6667L20 22.6667H4"
      fill="white"
    />
  </SVGIcon>
);

export const AdonisIconDark: React.FC<ISVGIconProps> = ({ ...props }) => (
  <SVGIcon {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.8734 10.5077L11.6196 4L2 23.2392H8.50764L6.50359 27.2473H29.5618L18.0327 4.18918L14.8734 10.5077ZM9.50406 23.2392H21.2392L15.3717 11.5041L17.9015 6.44444L27.8029 26.2473H8.00001L9.50406 23.2392Z"
      fill="black"
    />
  </SVGIcon>
);

export const AdonisIconLight: React.FC<ISVGIconProps> = ({ ...props }) => (
  <SVGIcon {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.8734 10.5077L11.6196 4L2 23.2392H8.50764L6.50359 27.2473H29.5618L18.0327 4.18918L14.8734 10.5077ZM9.50406 23.2392H21.2392L15.3717 11.5041L17.9015 6.44444L27.8029 26.2473H8.00001L9.50406 23.2392Z"
      fill="white"
    />
  </SVGIcon>
);

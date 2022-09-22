import React from 'react';
import { SVGIcon, ISVGIconProps } from './SVGIcon';

export const NuxtIcon: React.FC<ISVGIconProps> = ({ ...props }) => (
  <SVGIcon {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.3871 7.00777c-.8316-1.4297-2.9104-1.42973-3.7419 0L1.58298 22.5896c-.831514 1.4297.20788 3.2169 1.87091 3.2169h7.07451c-.71064-.6211-.97379-1.6954-.436-2.6172l6.8633-11.7649-2.5686-4.41663Z"
      fill="#80EEC0"
    />
    <path
      d="M20.1291 10.4257c.6881-1.16974 2.4085-1.16974 3.0967 0l7.4996 12.7488c.6883 1.1697-.1719 2.632-1.5481 2.632H14.1776c-1.3763 0-2.2365-1.4623-1.5483-2.632l7.4998-12.7488Z"
      fill="#00DC82"
    />
  </SVGIcon>
);

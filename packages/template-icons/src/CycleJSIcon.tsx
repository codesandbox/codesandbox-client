import React from 'react';
import { SVGIcon, ISVGIconProps } from './SVGIcon';
import { useUniqueId } from './useUniqueId';

export const CycleJSIcon: React.FC<ISVGIconProps> = ({ ...props }) => {
  const id = useUniqueId();
  return (
    <SVGIcon {...props}>
      <path
        d="M31.995 24.79C31.98 25.115 31.89 25.435 31.725 25.725L28.695 30.975C28.33 31.61 27.655 32 26.925 32H10.11C9.38 32 8.705 31.61 8.34 30.98L0.275 17.025C0.09 16.705 0 16.355 0 16C0 15.645 0.07 15.275 0.285 14.915L8.345 1.02C8.71 0.39 9.385 0 10.11 0H26.925C27.655 0 28.33 0.39 28.695 1.02C28.695 1.02 31.61 5.795 31.82 6.135C32.03 6.475 31.995 6.905 31.995 7.255C31.995 7.555 31.91 7.965 31.83 8.29C31.75 8.615 29.31 18.505 29.31 18.505L23.985 7.18H13.07L7.96 16L13.07 24.82H23.98L31.995 24.79Z"
        fill={`url(#CycleJS_Paint0_Linear_${id})`}
      />
      <path
        d="M28.105 15.995L31.805 23.84C32.09 24.445 32.06 25.15 31.725 25.73L23.985 24.825L28.105 15.995Z"
        fill={`url(#CycleJS_Paint1_Linear_${id})`}
      />
      <defs>
        <linearGradient
          id={`CycleJS_Paint0_Linear_${id}`}
          x1="9.33814"
          y1="31.8692"
          x2="27.6747"
          y2="0.114831"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.4147" stopColor="#51D3D9" />
          <stop offset="1" stopColor="#C8FF8C" />
        </linearGradient>
        <linearGradient
          id={`CycleJS_Paint1_Linear_${id}`}
          x1="26.7193"
          y1="26.3984"
          x2="32.9073"
          y2="19.1344"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.4147" stopColor="#51D3D9" />
          <stop offset="1" stopColor="#5A919B" />
        </linearGradient>
      </defs>
    </SVGIcon>
  );
};

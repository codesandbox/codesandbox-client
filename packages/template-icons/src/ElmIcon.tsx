import React from 'react';
import { SVGIcon, ISVGIconProps } from './SVGIcon';
import { useUniqueId } from './useUniqueId';

export const ElmIcon: React.FC<ISVGIconProps> = ({ ...props }) => {
  const id = useUniqueId();

  return (
    <SVGIcon {...props}>
      <g clipPath={`url(#Elm_Clip0_${id})`}>
        <path d="M16 16.8777L0.877846 32H31.1222L16 16.8777Z" fill="#5FB4CB" />
        <path
          d="M25.2916 24.4139L32 31.1224V17.7054L25.2916 24.4139Z"
          fill="#EEA400"
        />
        <path d="M15.1222 16L0 0.877747V31.1224L15.1222 16Z" fill="#596277" />
        <path d="M32 14.2258V0H17.7741L32 14.2258Z" fill="#5FB4CB" />
        <path
          d="M24.4479 8.42928L31.984 15.9654L24.4136 23.5358L16.8775 15.9997L24.4479 8.42928Z"
          fill="#8CD636"
        />
        <path
          d="M0.877655 0L7.84327 6.96571H22.9844L16.0187 0H0.877655Z"
          fill="#8CD636"
        />
        <path
          d="M16 15.1223L22.9152 8.20702H9.08467L16 15.1223Z"
          fill="#EEA400"
        />
      </g>
      <defs>
        <clipPath id={`Elm_Clip0_${id}`}>
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </SVGIcon>
  );
};

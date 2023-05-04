import React from 'react';
import { SVGIcon, ISVGIconProps } from './SVGIcon';
import { useUniqueId } from './useUniqueId';

export const SolidIcon: React.FC<ISVGIconProps> = ({ ...props }) => {
  const id = useUniqueId();

  return (
    <SVGIcon {...props} viewBox="0 0 166 155.3">
      <path
        fill="#76b3e1"
        d="M163 35S110-4 69 5l-3 1c-6 2-11 5-14 9l-2 3-15 26 26 5c11 7 25 10 38 7l46 9 18-30z"
      />
      <linearGradient
        id={`${id}-a`}
        x1="27.5"
        x2="152"
        y1="3"
        y2="63.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.1" stopColor="#76b3e1" />
        <stop offset="0.3" stopColor="#dcf2fd" />
        <stop offset="1" stopColor="#76b3e1" />
      </linearGradient>
      <path
        fill={`url(#${id}-a)`}
        d="M163 35S110-4 69 5l-3 1c-6 2-11 5-14 9l-2 3-15 26 26 5c11 7 25 10 38 7l46 9 18-30z"
        opacity="0.3"
      />
      <path
        fill="#518ac8"
        d="M52 35l-4 1c-17 5-22 21-13 35 10 13 31 20 48 15l62-21S92 26 52 35z"
      />
      <linearGradient
        id={`${id}-b`}
        x1="95.8"
        x2="74"
        y1="32.6"
        y2="105.2"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#76b3e1" />
        <stop offset="0.5" stopColor="#4377bb" />
        <stop offset="1" stopColor="#1f3b77" />
      </linearGradient>
      <path
        fill={`url(#${id}-b)`}
        d="M52 35l-4 1c-17 5-22 21-13 35 10 13 31 20 48 15l62-21S92 26 52 35z"
        opacity="0.3"
      />
      <linearGradient
        id={`${id}-c`}
        x1="18.4"
        x2="144.3"
        y1="64.2"
        y2="149.8"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#315aa9" />
        <stop offset="0.5" stopColor="#518ac8" />
        <stop offset="1" stopColor="#315aa9" />
      </linearGradient>
      <path
        fill={`url(#${id}-c)`}
        d="M134 80a45 45 0 00-48-15L24 85 4 120l112 19 20-36c4-7 3-15-2-23z"
      />
      <linearGradient
        id={`${id}-d`}
        x1="75.2"
        x2="24.4"
        y1="74.5"
        y2="260.8"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#4377bb" />
        <stop offset="0.5" stopColor="#1a336b" />
        <stop offset="1" stopColor="#1a336b" />
      </linearGradient>
      <path
        fill={`url(#${id}-d)`}
        d="M114 115a45 45 0 00-48-15L4 120s53 40 94 30l3-1c17-5 23-21 13-34z"
      />
    </SVGIcon>
  );
};

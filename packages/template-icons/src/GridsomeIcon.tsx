import React from 'react';
import { SVGIcon, ISVGIconProps } from './SVGIcon';
import { useUniqueId } from './useUniqueId';

export const GridsomeIcon: React.FC<ISVGIconProps> = ({ ...props }) => {
  const id = useUniqueId();

  return (
    <SVGIcon {...props}>
      <path
        d="M32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16Z"
        fill={`url(#Gridsome_Paint0_Linear_${id})`}
      />
      <path
        d="M20.023 16.1084C20.023 15.0478 20.8906 14.188 21.9609 14.188H24.7852C25.8555 14.188 26.75 15.0478 26.75 16.1084C26.75 17.1691 25.8555 18.0289 24.7852 18.0289H21.9609C20.8906 18.0289 20.023 17.1691 20.023 16.1084Z"
        fill="white"
      />
      <path
        d="M14.0971 16.1112C14.0971 15.0491 14.9593 14.188 16.0216 14.188C17.0839 14.188 17.9461 15.0491 17.9461 16.1112C17.9461 17.1734 17.0839 18.0345 16.0216 18.0345C14.9593 18.0345 14.0971 17.1734 14.0971 16.1112Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.8928 7.12549C17.9357 8.16055 17.1314 9.03449 16.0961 9.07749C11.6273 9.26305 8.89907 12.7652 9.03188 16.0906C9.0732 17.1257 8.28426 17.9984 7.24895 18.0397C6.21369 18.081 5.30327 17.2456 5.26193 16.2104C5.04553 10.7915 9.57082 5.43437 15.9404 5.32916C16.9757 5.28617 17.8498 6.09042 17.8928 7.12549Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.25604 16.0096C5.28146 22.557 10.6552 26.8836 16.0884 26.7499C22.5021 26.521 27.1353 20.9502 26.75 15.9773C26.6606 14.9445 25.7446 14.1439 24.7096 14.1935C23.6747 14.2432 22.876 15.1223 22.9256 16.157C23.0706 19.1793 20.2835 22.8807 15.9961 22.9995C12.5906 23.0833 9.18106 20.4094 9.03175 16.248C8.99187 17.2127 8.23131 18.0005 7.24894 18.0397C6.21365 18.081 5.30324 17.2456 5.2619 16.2104C5.25922 16.1435 5.25727 16.0765 5.25604 16.0096Z"
        fill={`url(#Gridsome_Paint1_Linear_${id})`}
      />
      <defs>
        <linearGradient
          id={`Gridsome_Paint0_Linear_${id}`}
          x1="7.75"
          y1="-2.3125"
          x2="-0.962181"
          y2="27.8966"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00A672" />
          <stop offset="1" stopColor="#008B60" />
        </linearGradient>
        <linearGradient
          id={`Gridsome_Paint1_Linear_${id}`}
          x1="16.4913"
          y1="27.8367"
          x2="16.4913"
          y2="15.7186"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.95" />
          <stop offset="1" stopColor="white" stopOpacity="0.5" />
        </linearGradient>
      </defs>
    </SVGIcon>
  );
};

import React from 'react';
import { SVGIcon, ISVGIconProps } from './SVGIcon';
import { useUniqueId } from './useUniqueId';

export const D3Icon: React.FC<ISVGIconProps> = ({ ...props }) => {
  const id = useUniqueId();

  return (
    <SVGIcon {...props}>
      <path
        d="M31.9503 22.9594C31.9647 22.8201 31.975 22.6793 31.983 22.538C31.9927 22.3706 21.9094 12.8035 21.9094 12.8035H21.6683C21.6683 12.8035 31.8886 23.584 31.9503 22.9594Z"
        fill={`url(#D3_Paint0_Linear_${id})`}
      />
      <path
        d="M10.4374 19.6407C10.424 19.67 10.4107 19.6994 10.397 19.7287C10.3827 19.7594 10.368 19.7901 10.3533 19.8204C10.0319 20.4906 14.8531 25.2038 15.2409 24.6313C15.2586 24.606 15.2763 24.5793 15.2939 24.5539C15.3136 24.5239 15.3329 24.4953 15.3523 24.4652C15.6624 23.9944 10.5751 19.3346 10.4374 19.6407Z"
        fill={`url(#D3_Paint1_Linear_${id})`}
      />
      <path
        d="M17.2502 26.2685C17.2366 26.2985 17.1395 26.4626 17.0508 26.5493C17.0358 26.5793 21.7574 31.2618 21.7574 31.2618H22.1825C22.1828 31.2618 17.7504 26.4666 17.2502 26.2685Z"
        fill={`url(#D3_Paint2_Linear_${id})`}
      />
      <path
        d="M31.9897 22.4529C31.7689 27.3478 27.7193 31.2618 22.7717 31.2618H22.1028L17.1619 26.3942C17.5683 25.821 17.9461 25.2272 18.2826 24.608H22.7717C24.1915 24.608 25.3469 23.4533 25.3469 22.0328C25.3469 20.613 24.1915 19.4576 22.7717 19.4576H20.1152C20.3176 18.3876 20.4283 17.2843 20.4283 16.1556C20.4283 15.0095 20.3156 13.8905 20.1058 12.8035H21.756L31.9607 22.8584C31.9727 22.7237 31.9823 22.589 31.9897 22.4529ZM2.6842 1H0V7.65382H2.6842C7.37238 7.65382 11.1869 11.4674 11.1869 16.1556C11.1869 17.431 10.9025 18.6417 10.397 19.7287L15.2939 24.5539C16.9018 22.1482 17.8418 19.2599 17.8418 16.1556C17.8418 7.79886 11.0419 1 2.6842 1Z"
        fill={`url(#D3_Paint3_Linear_${id})`}
      />
      <path
        d="M22.7717 1H11.9022C14.557 2.62086 16.7554 4.91927 18.2532 7.65382H22.7717C24.1915 7.65382 25.3469 8.80852 25.3469 10.229C25.3469 11.6491 24.1915 12.8038 22.7717 12.8038H21.7564L31.961 22.8587C31.985 22.586 32 22.3116 32 22.0328C32 19.7897 31.1951 17.7321 29.8586 16.1306C31.1951 14.5297 32 12.4717 32 10.229C32 5.14034 27.8607 1 22.7717 1Z"
        fill={`url(#D3_Paint4_Linear_${id})`}
      />
      <path
        d="M22.1028 31.2618H11.9799C14.0175 30.0034 15.7791 28.3422 17.1619 26.3942L22.1028 31.2618ZM15.2939 24.5539L10.3974 19.7287C9.04459 22.636 6.09664 24.658 2.6842 24.658H0V31.3111H2.6842C7.93723 31.3111 12.5737 28.6243 15.2939 24.5539Z"
        fill={`url(#D3_Paint5_Linear_${id})`}
      />
      <defs>
        <linearGradient
          id={`D3_Paint0_Linear_${id}`}
          x1="13.1446"
          y1="3.3525"
          x2="32.107"
          y2="23.8456"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F9A03C" />
          <stop offset="1" stopColor="#F7974E" />
        </linearGradient>
        <linearGradient
          id={`D3_Paint1_Linear_${id}`}
          x1="-2.68057"
          y1="7.04542"
          x2="15.3337"
          y2="24.5271"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F9A03C" />
          <stop offset="1" stopColor="#F7974E" />
        </linearGradient>
        <linearGradient
          id={`D3_Paint2_Linear_${id}`}
          x1="5.59879"
          y1="13.1877"
          x2="21.3725"
          y2="31.7735"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F9A03C" />
          <stop offset="1" stopColor="#F7974E" />
        </linearGradient>
        <linearGradient
          id={`D3_Paint3_Linear_${id}`}
          x1="3.62722"
          y1="0.448723"
          x2="24.8095"
          y2="30.006"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F26D58" />
          <stop offset="1" stopColor="#F9A03C" />
        </linearGradient>
        <linearGradient
          id={`D3_Paint4_Linear_${id}`}
          x1="15.0864"
          y1="1.84332"
          x2="37.07"
          y2="15.1247"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#B84E51" />
          <stop offset="1" stopColor="#F68E48" />
        </linearGradient>
        <linearGradient
          id={`D3_Paint5_Linear_${id}`}
          x1="10.3848"
          y1="22.4467"
          x2="10.6824"
          y2="36.8164"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F9A03C" />
          <stop offset="1" stopColor="#F7974E" />
        </linearGradient>
      </defs>
    </SVGIcon>
  );
};

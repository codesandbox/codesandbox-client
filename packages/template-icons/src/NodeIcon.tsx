import React from 'react';
import { SVGIcon, ISVGIconProps } from './SVGIcon';
import { useUniqueId } from './useUniqueId';

export const NodeIcon: React.FC<ISVGIconProps> = ({ ...props }) => {
  const id = useUniqueId();

  return (
    <SVGIcon {...props}>
      <g clipPath={`url(#Node_Clip0_${id})`}>
        <path
          d="M16.7587 0.20289C16.2903 -0.0676604 15.7127 -0.0676604 15.2443 0.20289L2.70125 7.44109C2.2322 7.71164 1.94345 8.21154 1.94345 8.75319V23.2408C1.94345 23.7819 2.2322 24.2819 2.70075 24.5529L15.2437 31.7969C15.7127 32.0676 16.2902 32.0676 16.7592 31.7969L29.2993 24.5529C29.7677 24.2818 30.0565 23.7819 30.0565 23.2408V8.75274C30.0565 8.21159 29.7677 7.71164 29.2988 7.44114L16.7587 0.20289Z"
          fill={`url(#Node_Paint0_Linear_${id})`}
        />
        <path
          d="M29.3237 7.4411L16.7456 0.202904C16.6215 0.131254 16.4886 0.0799036 16.3519 0.0462036L2.22934 24.2049C2.35104 24.3417 2.49359 24.4613 2.65214 24.553L15.2516 31.797C15.6085 32.003 16.0326 32.0512 16.4218 31.9436L29.6611 7.7006C29.5605 7.60075 29.4475 7.5125 29.3237 7.4411Z"
          fill={`url(#Node_Paint1_Linear_${id})`}
        />
        <path
          d="M29.3308 24.5529C29.6963 24.3414 29.9691 23.99 30.0724 23.5889L16.2839 0.0329378C15.9239 -0.0387622 15.542 0.0157878 15.218 0.202888L2.72439 7.39754L16.221 31.9852C16.4137 31.959 16.6022 31.8966 16.7749 31.797L29.3308 24.5529Z"
          fill={`url(#Node_Paint2_Linear_${id})`}
        />
        <path
          d="M30.5002 24.32L30.4171 24.1779V24.3681L30.5002 24.32Z"
          fill={`url(#Node_Paint3_Linear_${id})`}
        />
      </g>
      <defs>
        <linearGradient
          id={`Node_Paint0_Linear_${id}`}
          x1="21.0998"
          y1="5.59334"
          x2="9.76805"
          y2="28.71"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#41873F" />
          <stop offset="0.3288" stopColor="#418B3D" />
          <stop offset="0.6352" stopColor="#419637" />
          <stop offset="0.9319" stopColor="#3FA92D" />
          <stop offset="1" stopColor="#3FAE2A" />
        </linearGradient>
        <linearGradient
          id={`Node_Paint1_Linear_${id}`}
          x1="14.0908"
          y1="17.6914"
          x2="45.8868"
          y2="-5.80125"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.1376" stopColor="#41873F" />
          <stop offset="0.4032" stopColor="#54A044" />
          <stop offset="0.7136" stopColor="#66B848" />
          <stop offset="0.9081" stopColor="#6CC04A" />
        </linearGradient>
        <linearGradient
          id={`Node_Paint2_Linear_${id}`}
          x1="1.49974"
          y1="15.9939"
          x2="30.5002"
          y2="15.9939"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.0919" stopColor="#6CC04A" />
          <stop offset="0.2864" stopColor="#66B848" />
          <stop offset="0.5968" stopColor="#54A044" />
          <stop offset="0.8624" stopColor="#41873F" />
        </linearGradient>
        <linearGradient
          id={`Node_Paint3_Linear_${id}`}
          x1="1.49997"
          y1="24.273"
          x2="30.5002"
          y2="24.273"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.0919" stopColor="#6CC04A" />
          <stop offset="0.2864" stopColor="#66B848" />
          <stop offset="0.5968" stopColor="#54A044" />
          <stop offset="0.8624" stopColor="#41873F" />
        </linearGradient>
        <clipPath id={`Node_Clip0_${id}`}>
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </SVGIcon>
  );
};

export const NodeIconDark: React.FC<ISVGIconProps> = ({ ...props }) => (
  <SVGIcon {...props}>
    <path
      d="M16.6639 2.17753C16.254 1.9408 15.7486 1.9408 15.3388 2.17753L4.36358 8.51096C3.95316 8.74769 3.7005 9.1851 3.7005 9.65905V22.3357C3.7005 22.8092 3.95316 23.2467 4.36314 23.4838L15.3383 29.8223C15.7486 30.0591 16.254 30.0591 16.6643 29.8223L27.6369 23.4838C28.0468 23.2466 28.2994 22.8092 28.2994 22.3357V9.65865C28.2994 9.18515 28.0468 8.74769 27.6364 8.511L16.6639 2.17753Z"
      fill="black"
      fillOpacity="0.2"
    />
    <path
      d="M27.7076 8.47054L16.7017 2.13711C16.5931 2.07442 16.4768 2.02949 16.3573 2L4 23.1388C4.10649 23.2586 4.23122 23.3632 4.36995 23.4434L15.3945 29.782C15.7068 29.9622 16.0779 30.0043 16.4184 29.9102L28.0028 8.6976C27.9148 8.61023 27.8159 8.53301 27.7076 8.47054Z"
      fill="black"
      fillOpacity="0.6"
    />
    <path
      d="M27.6644 23.4838C27.9842 23.2988 28.2229 22.9912 28.3133 22.6403L16.2484 2.02883C15.9334 1.96609 15.5992 2.01382 15.3157 2.17753L4.38382 8.47285L16.1934 29.9871C16.362 29.9641 16.5269 29.9096 16.6781 29.8224L27.6644 23.4838Z"
      fill="black"
    />
  </SVGIcon>
);

export const NodeIconLight: React.FC<ISVGIconProps> = ({ ...props }) => (
  <SVGIcon {...props}>
    <path
      d="M16.6639 2.17753C16.254 1.9408 15.7486 1.9408 15.3388 2.17753L4.36358 8.51096C3.95316 8.74769 3.7005 9.1851 3.7005 9.65905V22.3357C3.7005 22.8092 3.95316 23.2467 4.36314 23.4838L15.3383 29.8223C15.7486 30.0591 16.254 30.0591 16.6643 29.8223L27.6369 23.4838C28.0468 23.2466 28.2994 22.8092 28.2994 22.3357V9.65865C28.2994 9.18515 28.0468 8.74769 27.6364 8.511L16.6639 2.17753Z"
      fill="white"
      fillOpacity="0.2"
    />
    <path
      d="M27.7076 8.47054L16.7017 2.13711C16.5931 2.07442 16.4768 2.02949 16.3573 2L4 23.1388C4.10649 23.2586 4.23122 23.3632 4.36995 23.4434L15.3945 29.782C15.7068 29.9622 16.0779 30.0043 16.4184 29.9102L28.0028 8.6976C27.9148 8.61023 27.8159 8.53301 27.7076 8.47054Z"
      fill="white"
      fillOpacity="0.6"
    />
    <path
      d="M27.6644 23.4838C27.9842 23.2988 28.2229 22.9912 28.3133 22.6403L16.2484 2.02883C15.9334 1.96609 15.5992 2.01382 15.3157 2.17753L4.38382 8.47285L16.1934 29.9871C16.362 29.9641 16.5269 29.9096 16.6781 29.8224L27.6644 23.4838Z"
      fill="white"
    />
  </SVGIcon>
);

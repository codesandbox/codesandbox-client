import React from 'react';
import { SVGIcon, ISVGIconProps } from './SVGIcon';
import { useUniqueId } from './useUniqueId';

export const AureliaIcon: React.FC<ISVGIconProps> = ({ ...props }) => {
  const id = useUniqueId();

  return (
    <SVGIcon {...props}>
      <path
        d="M20.8856 5.75526L17.9255 7.73085L14.8761 3.16098L17.8362 1.18539L20.8856 5.75526Z"
        fill={`url(#Aurelia_Paint0_Linear_${id})`}
      />
      <path
        d="M23.2921 19.4841L28.3497 27.0629L22.3249 31.0835L17.2674 23.5046L16.385 22.1826L22.4099 18.162L23.2921 19.4841Z"
        fill={`url(#Aurelia_Paint1_Linear_${id})`}
      />
      <path
        d="M15.7038 24.5479L16.8173 26.2165L12.2315 29.2768L10.2356 26.2861L11.2375 25.6175L14.8215 23.2258L15.7038 24.5479Z"
        fill={`url(#Aurelia_Paint2_Linear_${id})`}
      />
      <path
        d="M25.7976 15.9013L27.0838 15.0429L29.0796 18.0337L26.1192 20.0092L25.0056 18.3407L26.6798 17.2234L25.7976 15.9013ZM25.0056 18.3407L24.1234 17.0185L25.7976 15.9013L26.6798 17.2234L25.0056 18.3407Z"
        fill={`url(#Aurelia_Paint3_Linear_${id})`}
      />
      <path
        d="M5.03971 16.33L4.03798 16.9986L0.98834 12.4287L5.57414 9.36847L7.71174 12.5718L4.12779 14.9635L7.71174 12.5718L8.62378 13.9385L5.03971 16.33Z"
        fill={`url(#Aurelia_Paint4_Linear_${id})`}
      />
      <path
        d="M16.2121 8.87448L10.1872 12.8951L9.27531 11.5284L4.26505 4.02056L10.29 -3.05176e-05L15.3002 7.50781L16.2121 8.87448Z"
        fill={`url(#Aurelia_Paint5_Linear_${id})`}
      />
      <path
        d="M19.5998 6.61389L17.9256 7.73103L17.0136 6.36448L14.876 3.16116L17.8364 1.18558L20.8861 5.75544L19.5998 6.61389Z"
        fill={`url(#Aurelia_Paint6_Linear_${id})`}
      />
      <path
        d="M12.1198 26.9397L11.2375 25.6175L14.8215 23.2258L15.7038 24.5479L12.1198 26.9397Z"
        fill="#714896"
      />
      <path
        d="M25.0056 18.3407L24.1234 17.0185L25.7976 15.9013L26.6798 17.2234L25.0056 18.3407Z"
        fill="#6F4795"
      />
      <path
        d="M5.03971 16.33L4.12779 14.9635L7.71174 12.5717L8.62378 13.9384L5.03971 16.33Z"
        fill="#88519F"
      />
      <path
        d="M17.9256 7.731L17.0136 6.36444L18.6879 5.24718L19.5998 6.61385L17.9256 7.731Z"
        fill="#85509E"
      />
      <path
        d="M23.2921 19.4841L17.2674 23.5046L16.385 22.1826L22.4099 18.162L23.2921 19.4841Z"
        fill="#8D166A"
      />
      <path
        d="M15.3002 7.50781L16.2121 8.87449L10.1872 12.8951L9.27531 11.5284L15.3002 7.50781Z"
        fill="#A70D6F"
      />
      <path
        d="M3.33087 6.41579L4.46806 8.11989L2.76396 9.25707L1.62677 7.55297L3.33087 6.41579Z"
        fill="#9E61AD"
      />
      <path
        d="M9.47203 26.8447L10.6092 28.5488L8.90512 29.686L7.76794 27.9819L9.47203 26.8447Z"
        fill="#8053A3"
      />
      <path
        d="M4.98907 28.5609L4.76837e-06 21.0239L26.6621 3.19113L31.8937 10.6078L4.98907 28.5609Z"
        fill={`url(#Aurelia_Paint7_Linear_${id})`}
      />
      <defs>
        <linearGradient
          id={`Aurelia_Paint0_Linear_${id}`}
          x1="-8.44944"
          y1="-6.25533"
          x2="31.5107"
          y2="22.1375"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C06FBB" />
          <stop offset="1" stopColor="#6E4D9B" />
        </linearGradient>
        <linearGradient
          id={`Aurelia_Paint1_Linear_${id}`}
          x1="25.1127"
          y1="28.4365"
          x2="2.94525"
          y2="4.40661"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6E4D9B" />
          <stop offset="0.14" stopColor="#77327A" />
          <stop offset="0.29" stopColor="#B31777" />
          <stop offset="0.84" stopColor="#CD0F7E" />
          <stop offset="1" stopColor="#ED2C89" />
        </linearGradient>
        <linearGradient
          id={`Aurelia_Paint2_Linear_${id}`}
          x1="-5.04782"
          y1="-18.7438"
          x2="22.9903"
          y2="31.4743"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C06FBB" />
          <stop offset="1" stopColor="#6E4D9B" />
        </linearGradient>
        <linearGradient
          id={`Aurelia_Paint3_Linear_${id}`}
          x1="-16.576"
          y1="-8.14625"
          x2="29.2528"
          y2="29.2176"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C06FBB" />
          <stop offset="1" stopColor="#6E4D9B" />
        </linearGradient>
        <linearGradient
          id={`Aurelia_Paint4_Linear_${id}`}
          x1="-9.7085"
          y1="-8.25145"
          x2="32.9166"
          y2="29.3871"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C06FBB" />
          <stop offset="1" stopColor="#6E4D9B" />
        </linearGradient>
        <linearGradient
          id={`Aurelia_Paint5_Linear_${id}`}
          x1="27.094"
          y1="29.0225"
          x2="4.87304"
          y2="4.84826"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6E4D9B" />
          <stop offset="0.14" stopColor="#77327A" />
          <stop offset="0.29" stopColor="#B31777" />
          <stop offset="0.84" stopColor="#CD0F7E" />
          <stop offset="1" stopColor="#ED2C89" />
        </linearGradient>
        <linearGradient
          id={`Aurelia_Paint6_Linear_${id}`}
          x1="-8.44865"
          y1="-7.89477"
          x2="32.1246"
          y2="26.8809"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C06FBB" />
          <stop offset="1" stopColor="#6E4D9B" />
        </linearGradient>
        <linearGradient
          id={`Aurelia_Paint7_Linear_${id}`}
          x1="3.66889"
          y1="25.9358"
          x2="23.0417"
          y2="1.65607"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6E4D9B" />
          <stop offset="0.14" stopColor="#77327A" />
          <stop offset="0.53" stopColor="#B31777" />
          <stop offset="0.79" stopColor="#CD0F7E" />
          <stop offset="1" stopColor="#ED2C89" />
        </linearGradient>
      </defs>
    </SVGIcon>
  );
};

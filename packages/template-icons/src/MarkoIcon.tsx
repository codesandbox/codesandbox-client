import React from 'react';
import { SVGIcon, ISVGIconProps } from './SVGIcon';
import { useUniqueId } from './useUniqueId';

export const MarkoIcon: React.FC<ISVGIconProps> = ({ ...props }) => {
  const id = useUniqueId();

  return (
    <SVGIcon {...props}>
      <path
        d="M16.0125 9.125H20.525C18.8625 11.85 17.025 14.85 15.1875 17.8375H10.675C12.5125 14.85 14.35 11.85 16.0125 9.125Z"
        fill="#8DC220"
      />
      <path
        d="M5.3375 9.125H9.85C8.9625 10.575 8.0625 12.0375 7.175 13.4875C6.2875 14.9375 5.4 16.3875 4.5125 17.8375C5.4 19.2875 6.2875 20.75 7.175 22.2C8.0625 23.65 8.95 25.1 9.85 26.55H5.3375C4.45 25.1 3.55 23.65 2.6625 22.2C1.775 20.7625 0.8875 19.3 0 17.85C0.8875 16.4 1.775 14.95 2.6625 13.5C3.55 12.0375 4.45 10.5875 5.3375 9.125Z"
        fill="#44BFEF"
      />
      <path
        d="M5.33749 9.125C7.17499 12.125 9.01249 15.125 10.675 17.8375H15.1875C13.525 15.125 11.6875 12.125 9.84999 9.125H5.33749Z"
        fill="#00AC71"
      />
      <path
        d="M20.525 9.125H16.0125C16.9 10.575 17.7875 12.0375 18.6875 13.4875C19.575 14.9375 20.4625 16.3875 21.3625 17.8375C20.475 19.2875 19.575 20.75 18.6875 22.2C17.8 23.65 16.9125 25.1 16.0125 26.55H20.525C21.4125 25.1 22.3 23.65 23.2 22.2C24.0875 20.75 24.975 19.3 25.875 17.8375C24.975 16.3875 24.0875 14.9375 23.2 13.4875C22.3125 12.0375 21.4125 10.5875 20.525 9.125Z"
        fill="#F9BC00"
      />
      <path
        d="M18.6625 12.2H14.15C13.575 13.1375 13 14.0875 12.425 15.025C11.85 15.9625 11.275 16.9125 10.6875 17.85H15.2C15.775 16.9125 16.3625 15.9625 16.9375 15.025C17.5 14.075 18.075 13.1375 18.6625 12.2Z"
        fill={`url(#Marko_Paint0_Linear_${id})`}
      />
      <path
        d="M12.5625 14.775H17.075C17.65 13.8375 18.225 12.8875 18.8 11.95C19.375 11.0125 19.95 10.0625 20.525 9.125H16.0125C15.4375 10.0625 14.8625 11.0125 14.2875 11.95C13.7125 12.9 13.1375 13.8375 12.5625 14.775Z"
        fill={`url(#Marko_Paint1_Linear_${id})`}
      />
      <path
        d="M23.9875 14.775H19.475C18.9 13.8375 18.3125 12.8875 17.7375 11.95C17.1625 11.0125 16.5875 10.0625 16.0125 9.125H20.525C21.1 10.0625 21.675 11.0125 22.25 11.95C22.8375 12.9 23.4125 13.8375 23.9875 14.775Z"
        fill={`url(#Marko_Paint2_Linear_${id})`}
      />
      <path
        d="M26.65 9.125H22.1375C23.025 10.5875 23.9125 12.0375 24.8 13.4875C25.6875 14.9375 26.5875 16.3875 27.475 17.8375C26.5875 19.2875 25.6875 20.75 24.8 22.2C23.9125 23.65 23.025 25.1 22.125 26.55H26.6375C27.525 25.1 28.4125 23.65 29.3125 22.2C30.2 20.75 31.0875 19.3 31.9875 17.8375C31.1 16.3875 30.2125 14.9375 29.3125 13.4875C28.4375 12.0375 27.5375 10.5875 26.65 9.125Z"
        fill="#DF1B1C"
      />
      <path
        d="M30.1125 14.775H25.6C25.0125 13.8375 24.4375 12.8875 23.8625 11.95C23.2875 11.0125 22.7125 10.0625 22.1375 9.125H26.65C27.225 10.0625 27.8 11.0125 28.375 11.95C28.95 12.9 29.5375 13.8375 30.1125 14.775Z"
        fill={`url(#Marko_Paint3_Linear_${id})`}
      />
      <path
        d="M24.025 23.5H28.5375C29.1125 22.5625 29.6875 21.625 30.2625 20.675C30.8375 19.7375 31.4125 18.7875 32 17.85H27.475C26.9 18.7875 26.325 19.7375 25.75 20.675C25.175 21.6125 24.6 22.55 24.025 23.5Z"
        fill={`url(#Marko_Paint4_Linear_${id})`}
      />
      <path
        d="M17.9 23.5H22.4125C22.9875 22.5625 23.5625 21.6125 24.1375 20.675C24.7125 19.7375 25.2875 18.7875 25.875 17.85H21.3625C20.7875 18.7875 20.2125 19.7375 19.6375 20.675C19.05 21.6125 18.475 22.55 17.9 23.5Z"
        fill={`url(#Marko_Paint5_Linear_${id})`}
      />
      <path
        d="M7.975 12.2H3.4625C2.8875 13.1375 2.3125 14.0875 1.7375 15.025C1.15 15.9625 0.575 16.9125 0 17.85H4.5125C5.0875 16.9125 5.6625 15.975 6.2375 15.025C6.8125 14.0875 7.3875 13.1375 7.975 12.2Z"
        fill={`url(#Marko_Paint6_Linear_${id})`}
      />
      <path
        d="M1.875 14.775H6.3875C6.9625 13.8375 7.5375 12.8875 8.1125 11.95C8.7 11.0125 9.275 10.0625 9.85 9.125H5.3375C4.7625 10.0625 4.1875 11 3.6125 11.95C3.0375 12.8875 2.4625 13.8375 1.875 14.775Z"
        fill={`url(#Marko_Paint7_Linear_${id})`}
      />
      <path
        d="M1.875 20.9125H6.3875C6.9625 21.85 7.5375 22.8 8.1125 23.7375C8.6875 24.675 9.2625 25.625 9.8375 26.5625H5.325C4.75 25.625 4.1625 24.6875 3.5875 23.7375C3.025 22.8 2.45 21.8625 1.875 20.9125Z"
        fill={`url(#Marko_Paint8_Linear_${id})`}
      />
      <path
        d="M13.3125 14.775H8.79999C8.22499 13.8375 7.64999 12.8875 7.07499 11.95C6.48749 11.0125 5.91249 10.0625 5.33749 9.125H9.84999C10.425 10.0625 11 11 11.575 11.95C12.1625 12.8875 12.7375 13.8375 13.3125 14.775Z"
        fill={`url(#Marko_Paint9_Linear_${id})`}
      />
      <defs>
        <linearGradient
          id={`Marko_Paint0_Linear_${id}`}
          x1="14.6679"
          y1="17.8448"
          x2="14.6679"
          y2="12.1949"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8AC23E" />
          <stop offset="1" stopColor="#8AC23E" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`Marko_Paint1_Linear_${id}`}
          x1="16.5424"
          y1="9.1286"
          x2="16.5424"
          y2="14.7785"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#698932" />
          <stop offset="1" stopColor="#698932" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`Marko_Paint2_Linear_${id}`}
          x1="20.0047"
          y1="9.1286"
          x2="20.0047"
          y2="14.7785"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFED01" />
          <stop offset="1" stopColor="#FFED01" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`Marko_Paint3_Linear_${id}`}
          x1="26.1264"
          y1="9.1286"
          x2="26.1264"
          y2="14.7802"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E02A89" />
          <stop offset="1" stopColor="#E02A89" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`Marko_Paint4_Linear_${id}`}
          x1="28.0096"
          y1="17.8448"
          x2="28.0096"
          y2="23.4947"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7F1E4F" />
          <stop offset="1" stopColor="#7F1E4F" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`Marko_Paint5_Linear_${id}`}
          x1="21.8847"
          y1="17.8448"
          x2="21.8847"
          y2="23.4947"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E95506" />
          <stop offset="1" stopColor="#E95506" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`Marko_Paint6_Linear_${id}`}
          x1="3.98564"
          y1="17.8448"
          x2="3.98564"
          y2="12.1985"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#88D0F1" />
          <stop offset="1" stopColor="#88D0F1" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`Marko_Paint7_Linear_${id}`}
          x1="5.86414"
          y1="9.1286"
          x2="5.86414"
          y2="14.7749"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00828B" />
          <stop offset="0.8325" stopColor="#00828B" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`Marko_Paint8_Linear_${id}`}
          x1="5.86246"
          y1="26.5611"
          x2="5.86246"
          y2="20.9165"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2073BA" />
          <stop offset="1" stopColor="#2073BA" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`Marko_Paint9_Linear_${id}`}
          x1="9.32641"
          y1="9.1286"
          x2="9.32641"
          y2="14.7749"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8ED0E1" />
          <stop offset="1" stopColor="#88D0F1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </SVGIcon>
  );
};

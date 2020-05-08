import React from 'react';
import { SVGIcon, ISVGIconProps } from './SVGIcon';
import { useUniqueId } from './useUniqueId';

export const ReasonIcon: React.FC<ISVGIconProps> = ({ ...props }) => {
  const id = useUniqueId();

  return (
    <SVGIcon {...props}>
      <g filter={`url(#Reason_Filter0_i_${id})`}>
        <path d="M31.7064 0H0V31.7064H31.7064V0Z" fill="black" />
      </g>
      <path d="M31.7064 0H0V31.7064H31.7064V0Z" fill="#DD4B39" />
      <path
        d="M31.633 0.0733953H0.0733948V31.633H31.633V0.0733953Z"
        stroke="#D74837"
        strokeWidth="0.146789"
      />
      <path
        d="M18.8078 28.9174H15.2223L13.4555 25.5571H11.0999V28.9174H7.93011V16.7753H13.3863C16.608 16.7753 18.444 18.3342 18.444 21.0363C18.444 22.8724 17.6819 24.2234 16.2789 24.9509L18.8078 28.9174ZM11.0999 19.3042V23.0282H13.4036C14.6853 23.0282 15.4302 22.37 15.4302 21.1402C15.4302 19.9451 14.6853 19.3042 13.4036 19.3042H11.0999ZM20.4706 16.7753H30.0492V19.3042H23.6404V21.5733H29.4256V24.0848L23.6404 24.1022V26.3885H30.2224V28.9174H20.4706V16.7753Z"
        fill="white"
      />
      <g filter={`url(#Reason_Filter1_i_${id})`}>
        <path
          d="M18.8078 28.9174H15.2223L13.4555 25.5571H11.0999V28.9174H7.93011V16.7753H13.3863C16.608 16.7753 18.444 18.3342 18.444 21.0363C18.444 22.8724 17.6819 24.2234 16.2789 24.9509L18.8078 28.9174ZM11.0999 19.3042V23.0282H13.4036C14.6853 23.0282 15.4302 22.37 15.4302 21.1402C15.4302 19.9451 14.6853 19.3042 13.4036 19.3042H11.0999ZM20.4706 16.7753H30.0492V19.3042H23.6404V21.5733H29.4256V24.0848L23.6404 24.1022V26.3885H30.2224V28.9174H20.4706V16.7753Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id={`Reason_Filter0_i_${id}`}
          x="0"
          y="0"
          width="31.7064"
          height="32"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0.293578" />
          <feGaussianBlur stdDeviation="0.293578" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0"
          />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
        </filter>
        <filter
          id={`Reason_Filter1_i_${id}`}
          x="7.93011"
          y="16.7753"
          width="22.2923"
          height="12.4357"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0.293578" />
          <feGaussianBlur stdDeviation="0.293578" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0"
          />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
        </filter>
      </defs>
    </SVGIcon>
  );
};

export const ReasonIconDark: React.FC<ISVGIconProps> = ({ ...props }) => {
  const id = useUniqueId();
  return (
    <SVGIcon {...props}>
      <g filter={`url(#filter_${id})`}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1 1h30v30H1V1zm14.403 27.361h3.393l-2.393-3.753c1.327-.688 2.048-1.967 2.048-3.704 0-2.556-1.737-4.032-4.785-4.032H8.503v11.49h3v-3.18h2.228l1.672 3.18zm-3.9-5.572v-3.524h2.18c1.212 0 1.917.607 1.917 1.738 0 1.163-.705 1.786-1.918 1.786h-2.18zm17.929-5.917h-9.063v11.49h9.227v-2.394h-6.228v-2.163l5.474-.016v-2.377h-5.474v-2.147h6.064v-2.393z"
          fill="#000"
        />
      </g>
      <defs>
        <filter
          id={`filter_${id}`}
          x="1"
          y="1"
          width="30"
          height="30.278"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy=".278" />
          <feGaussianBlur stdDeviation=".278" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0" />
          <feBlend in2="shape" result="effect1_innerShadow" />
        </filter>
      </defs>
    </SVGIcon>
  );
};

export const ReasonIconLight: React.FC<ISVGIconProps> = ({ ...props }) => {
  const id = useUniqueId();
  return (
    <SVGIcon {...props}>
      <g filter={`url(#filter_${id})`}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1 1h30v30H1V1zm14.403 27.361h3.393l-2.393-3.753c1.327-.688 2.048-1.967 2.048-3.704 0-2.556-1.737-4.032-4.785-4.032H8.503v11.49h3v-3.18h2.228l1.672 3.18zm-3.9-5.572v-3.524h2.18c1.212 0 1.917.607 1.917 1.738 0 1.163-.705 1.786-1.918 1.786h-2.18zm17.929-5.917h-9.063v11.49h9.227v-2.394h-6.228v-2.163l5.474-.016v-2.377h-5.474v-2.147h6.064v-2.393z"
          fill="#fff"
        />
      </g>
      <defs>
        <filter
          id={`filter_${id}`}
          x="1"
          y="1"
          width="30"
          height="30.278"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy=".278" />
          <feGaussianBlur stdDeviation=".278" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0" />
          <feBlend in2="shape" result="effect1_innerShadow" />
        </filter>
      </defs>
    </SVGIcon>
  );
};

import React from 'react';
import { SVGIcon, ISVGIconProps } from './SVGIcon';
import { useUniqueId } from './useUniqueId';

export const RollupIcon: React.FC<ISVGIconProps> = ({ ...props }) => {
  const id = useUniqueId();

  return (
    <SVGIcon {...props}>
      <g clipPath={`url(#Rollup_Clip0_${id})`}>
        <path
          d="M28.4374 10.5146C28.4374 8.63436 27.945 6.87167 27.0776 5.34401C24.7778 2.97698 19.7751 2.42859 18.5328 5.33282C17.257 8.3098 20.676 11.6225 22.1701 11.3595C24.0727 11.0238 21.8344 6.65903 21.8344 6.65903C24.7442 12.1429 24.0727 10.4642 18.8126 15.5004C13.5525 20.5367 8.18055 31.1631 7.39714 31.6108C7.36356 31.6332 7.32999 31.65 7.29082 31.6667H27.9226C28.2863 31.6667 28.5214 31.2806 28.3591 30.9561L22.9647 20.2793C22.8472 20.0498 22.9311 19.7644 23.155 19.6357C26.311 17.8227 28.4374 14.4204 28.4374 10.5146Z"
          fill={`url(#Rollup_Paint0_Linear_${id})`}
        />
        <path
          d="M28.4374 10.5146C28.4374 8.63436 27.945 6.87167 27.0776 5.34401C24.7778 2.97698 19.7751 2.42859 18.5328 5.33282C17.257 8.3098 20.676 11.6225 22.1701 11.3595C24.0727 11.0238 21.8344 6.65903 21.8344 6.65903C24.7442 12.1429 24.0727 10.4642 18.8126 15.5004C13.5525 20.5367 8.18055 31.1631 7.39714 31.6108C7.36356 31.6332 7.32999 31.65 7.29082 31.6667H27.9226C28.2863 31.6667 28.5214 31.2806 28.3591 30.9561L22.9647 20.2793C22.8472 20.0498 22.9311 19.7644 23.155 19.6357C26.311 17.8227 28.4374 14.4204 28.4374 10.5146Z"
          fill={`url(#Rollup_Paint1_Linear_${id})`}
        />
        <path
          d="M7.39713 31.6108C8.18054 31.1631 13.5525 20.5311 18.8126 15.4948C24.0727 10.4586 24.7442 12.1373 21.8343 6.65343C21.8343 6.65343 10.6987 22.2658 6.66967 29.988"
          fill={`url(#Rollup_Paint2_Linear_${id})`}
        />
        <path
          d="M8.96397 17.6212C16.4847 3.79397 17.4696 2.40061 21.3867 2.40061C23.4459 2.40061 25.522 3.32951 26.865 4.98028C25.0352 2.03128 21.7952 0.0559582 18.0852 0H5.3099C5.0413 0 4.82306 0.218237 4.82306 0.486837V26.2388C5.58409 24.2747 6.87672 21.4656 8.96397 17.6212Z"
          fill={`url(#Rollup_Paint3_Linear_${id})`}
        />
        <path
          d="M18.8126 15.4948C13.5525 20.5311 8.18055 31.1631 7.39713 31.6108C6.61372 32.0585 5.2987 32.1144 4.59922 31.331C3.85498 30.4972 2.69664 29.1486 8.96396 17.6212C16.4847 3.79397 17.4696 2.4006 21.3867 2.4006C23.4459 2.4006 25.522 3.32951 26.865 4.98028C26.9377 5.09779 27.0105 5.2209 27.0832 5.34401C24.7833 2.97697 19.7807 2.42858 18.5384 5.33281C17.2626 8.30979 20.6816 11.6225 22.1757 11.3595C24.0783 11.0238 21.8399 6.65902 21.8399 6.65902C24.7442 12.1373 24.0727 10.4586 18.8126 15.4948Z"
          fill={`url(#Rollup_Paint4_Linear_${id})`}
        />
        <path
          opacity="0.3"
          d="M9.5795 18.2368C17.1003 4.4095 18.0851 3.01614 22.0022 3.01614C23.6978 3.01614 25.4045 3.64847 26.7027 4.79002C25.3597 3.25676 23.3676 2.4006 21.3867 2.4006C17.4696 2.4006 16.4847 3.79396 8.96396 17.6212C2.69664 29.1486 3.85498 30.4972 4.59922 31.331C4.70554 31.4485 4.82865 31.5492 4.95735 31.6331C4.30264 30.6819 4.01166 28.4715 9.5795 18.2368Z"
          fill={`url(#Rollup_Paint5_Linear_${id})`}
        />
      </g>
      <defs>
        <linearGradient
          id={`Rollup_Paint0_Linear_${id}`}
          x1="12.9632"
          y1="17.0086"
          x2="21.695"
          y2="18.1474"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF6533" />
          <stop offset="0.157" stopColor="#FF5633" />
          <stop offset="0.434" stopColor="#FF4333" />
          <stop offset="0.714" stopColor="#FF3733" />
          <stop offset="1" stopColor="#FF3333" />
        </linearGradient>
        <linearGradient
          id={`Rollup_Paint1_Linear_${id}`}
          x1="11.6154"
          y1="14.1519"
          x2="28.989"
          y2="21.6678"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BF3338" />
          <stop offset="1" stopColor="#FF3333" />
        </linearGradient>
        <linearGradient
          id={`Rollup_Paint2_Linear_${id}`}
          x1="12.1192"
          y1="16.5108"
          x2="14.8553"
          y2="17.8243"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF6533" />
          <stop offset="0.157" stopColor="#FF5633" />
          <stop offset="0.434" stopColor="#FF4333" />
          <stop offset="0.714" stopColor="#FF3733" />
          <stop offset="1" stopColor="#FF3333" />
        </linearGradient>
        <linearGradient
          id={`Rollup_Paint3_Linear_${id}`}
          x1="16.1888"
          y1="20.5566"
          x2="15.2399"
          y2="10.9592"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF6533" />
          <stop offset="0.157" stopColor="#FF5633" />
          <stop offset="0.434" stopColor="#FF4333" />
          <stop offset="0.714" stopColor="#FF3733" />
          <stop offset="1" stopColor="#FF3333" />
        </linearGradient>
        <linearGradient
          id={`Rollup_Paint4_Linear_${id}`}
          x1="13.2797"
          y1="16.3459"
          x2="16.7573"
          y2="17.7903"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FBB040" />
          <stop offset="1" stopColor="#FB8840" />
        </linearGradient>
        <linearGradient
          id={`Rollup_Paint5_Linear_${id}`}
          x1="16.537"
          y1="4.12177"
          x2="11.2033"
          y2="39.5083"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`Rollup_Clip0_${id}`}>
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </SVGIcon>
  );
};

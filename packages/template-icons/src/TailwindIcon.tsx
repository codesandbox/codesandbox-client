import React from 'react';
import { SVGIcon, ISVGIconProps } from './SVGIcon';
import { useUniqueId } from './useUniqueId';

export const TailwindIcon: React.FC<ISVGIconProps> = ({ ...props }) => {
  const id = useUniqueId();

  return (
    <SVGIcon {...props}>
      <path
        d="M7.99884 12.6676C9.0669 8.22319 11.7329 6 16.0005 6C22.4005 6 23.2003 10.9993 26.3999 11.8335C28.5323 12.3883 30.3993 11.5551 32 9.33285C30.9329 13.7773 28.266 15.9995 24.0002 15.9995C17.6002 15.9995 16.8003 10.9993 13.6008 10.1661C11.4675 9.61123 9.60047 10.4444 8.0007 12.6667L7.99884 12.6676ZM0 22.6672C1.0662 18.2217 3.73403 16.0005 7.99884 16.0005C14.3998 16.0005 15.1997 21.0007 18.4001 21.8339C20.5325 22.3888 22.3986 21.5556 23.9993 19.3333C22.9322 23.7778 20.2653 26 15.9995 26C9.59953 26 8.79965 21.0007 5.60012 20.1665C3.46678 19.6117 1.59977 20.4449 0 22.6672H0Z"
        fill={`url(#tailwind_color_gradient_${id})`}
      />
      <defs>
        <linearGradient
          id={`tailwind_color_gradient_${id}`}
          x1="1.23227e-07"
          y1="12.4009"
          x2="27.141"
          y2="28.0339"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2383AE" />
          <stop offset="1" stopColor="#6DD7B9" />
        </linearGradient>
      </defs>
    </SVGIcon>
  );
};

export const TailwindIconDark: React.FC<ISVGIconProps> = ({ ...props }) => {
  const id = useUniqueId();

  return (
    <SVGIcon {...props}>
      <path
        d="M7.99884 13.3343C9.0669 8.88986 11.7329 6.66667 16.0005 6.66667C22.4005 6.66667 23.2003 11.6659 26.3999 12.5001C28.5323 13.055 30.3993 12.2217 32 9.99952C30.9329 14.444 28.266 16.6662 24.0002 16.6662C17.6002 16.6662 16.8003 11.6659 13.6008 10.8327C11.4675 10.2779 9.60047 11.1111 8.0007 13.3333L7.99884 13.3343ZM0 23.3338C1.0662 18.8884 3.73403 16.6672 7.99884 16.6672C14.3998 16.6672 15.1997 21.6674 18.4001 22.5006C20.5325 23.0554 22.3986 22.2222 23.9993 20C22.9322 24.4444 20.2653 26.6667 15.9995 26.6667C9.59953 26.6667 8.79965 21.6674 5.60012 20.8332C3.46678 20.2784 1.59977 21.1116 0 23.3338H0Z"
        fill={`url(#tailwind_dark_gradient_${id})`}
      />
      <defs>
        <linearGradient
          id={`tailwind_dark_gradient_${id}`}
          x1="1.23227e-07"
          y1="13.0676"
          x2="27.141"
          y2="28.7006"
          gradientUnits="userSpaceOnUse"
        >
          <stop />
          <stop offset="1" stopColor="#A2A2A2" />
        </linearGradient>
      </defs>
    </SVGIcon>
  );
};

export const TailwindIconLight: React.FC<ISVGIconProps> = ({ ...props }) => {
  const id = useUniqueId();

  return (
    <SVGIcon {...props}>
      <path
        d="M7.99884 13.3343C9.0669 8.88986 11.7329 6.66667 16.0005 6.66667C22.4005 6.66667 23.2003 11.6659 26.3999 12.5001C28.5323 13.055 30.3993 12.2217 32 9.99952C30.9329 14.444 28.266 16.6662 24.0002 16.6662C17.6002 16.6662 16.8003 11.6659 13.6008 10.8327C11.4675 10.2779 9.60047 11.1111 8.0007 13.3333L7.99884 13.3343ZM0 23.3338C1.0662 18.8884 3.73403 16.6672 7.99884 16.6672C14.3998 16.6672 15.1997 21.6674 18.4001 22.5006C20.5325 23.0554 22.3986 22.2222 23.9993 20C22.9322 24.4444 20.2653 26.6667 15.9995 26.6667C9.59953 26.6667 8.79965 21.6674 5.60012 20.8332C3.46678 20.2784 1.59977 21.1116 0 23.3338H0Z"
        fill={`url(#tailwind_light_gradient_${id})`}
      />
      <defs>
        <linearGradient
          id={`tailwind_light_gradient_${id}`}
          x1="1.23227e-07"
          y1="13.0676"
          x2="27.141"
          y2="28.7006"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#A2A2A2" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>
    </SVGIcon>
  );
};

import React from 'react';
import { SVGIcon, ISVGIconProps } from './SVGIcon';

export const TramvaiIcon: React.FC<ISVGIconProps> = ({ ...props }) => (
  <SVGIcon {...props}>
    <style>{'.st0{fill-rule:evenodd;clip-rule:evenodd}.st1{fill:#fff}'}</style>
    <path
      d="M80.8 100.6h-61C8.9 100.6 0 91.7 0 80.8v-61C0 8.9 8.9 0 19.8 0h60.9c11 0 19.8 8.9 19.8 19.8v60.9c.1 11-8.8 19.9-19.7 19.9z"
      style={{
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        fill: '#ffdd2d',
      }}
    />
    <path d="M53 58.8c0 2.2 2.3 2.6 4.2 2.6 1.7 0 2.8-.1 3.8-.3v9.1c-2.2.4-5.9.6-8.1.6-6.8 0-11.5-2.3-11.5-10.9V43.8h-4.6v-9.2h4.6v-8.2H53v8.2h8v9.2h-8v15z" />
  </SVGIcon>
);

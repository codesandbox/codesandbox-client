import React from 'react';

export type OptionProps = {
  blink?: boolean;
  highlight?: boolean;
  hideBottomHighlight?: boolean;
  theme: any;
};

export interface ActionProps {
  moreInfo?: boolean;
  unresponsive?: boolean;
  iconProps?: object;
  iconContainerProps?: object;
  title?: string;
  tooltip?: string;
  highlight?: boolean;
  placeholder?: string | false;
  blink?: boolean;
  href?: string;
  a?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  Icon: React.ComponentType;
}

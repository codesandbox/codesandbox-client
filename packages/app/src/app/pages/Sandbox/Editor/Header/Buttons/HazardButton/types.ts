import React from 'react';

export interface HarzardButtonProps {
  type?: 'button' | 'reset' | 'submit';
  title?: string;
  color?: string;
  hover?: string;
  onClick?: () => {};
  children: React.ReactNode;
}

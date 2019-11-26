import React from 'react';
import { LinkButton, AButton, Button, styles } from './elements';

export interface IButtonProps {
  to?: string;
  href?: string;
  big?: boolean;
  small?: boolean;
  style?: React.CSSProperties;
  block?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'reset' | 'submit';
  danger?: boolean;
  secondary?: boolean;
  red?: boolean;
  target?: string;
  rel?: string;
}

function ButtonComponent({ style = {}, ...props }: IButtonProps) {
  // Link
  if (typeof props.to === 'string') {
    return <LinkButton style={style} to={props.to} {...props} />;
  }

  if (props.href) {
    // @ts-ignore
    return <AButton style={style} {...props} />;
  }

  // @ts-ignore
  return <Button style={style} {...props} />;
}

export { ButtonComponent as Button, styles as buttonStyles };

import React from 'react';
import { Link, ILinkProps } from '../../Link';
import { Base, ButtonIcon } from './elements';

export interface IButtonProps extends ILinkProps {
  Icon?: React.ReactNode;
  href?: string;
  small?: boolean;
  block?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  disabled?: boolean;
  type?: 'button' | 'reset' | 'submit';
  secondary?: boolean;
  red?: boolean;
  danger?: boolean;
}

export const Button: React.FC<IButtonProps> = React.forwardRef<
  HTMLAnchorElement,
  IButtonProps
>(({ Icon, children, ...props }, ref) => (
  <Base
    ref={ref}
    {...(props.to || props.href
      ? {
          as: props.to ? Link : `a`,
          ...props,
        }
      : props)}
  >
    {Icon && (
      <ButtonIcon>
        <Icon />
      </ButtonIcon>
    )}
    {children}
  </Base>
));

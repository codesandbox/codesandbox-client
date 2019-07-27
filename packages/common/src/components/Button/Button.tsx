import React from 'react';
import { Link, ILinkProps } from '../Link';
import { Base, ButtonIcon } from './elements';
import { withoutProps } from '../../utils';

export interface IButtonProps extends ILinkProps {
  Icon?: any;
  href?: string;
  small?: boolean;
  block?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  disabled?: boolean;
  type?: 'button' | 'reset' | 'submit';
  secondary?: boolean;
  red?: boolean;
  danger?: boolean;
  style?: React.CSSProperties;
}

export const Button: React.FC<IButtonProps> = ({
  Icon,
  style,
  children,
  ...props
}) => (
  <Base
    {...(props.to || props.href
      ? {
          as: props.to
            ? withoutProps(`small`, `block`, `secondary`, `red`, `danger`)(Link)
            : `a`,
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
);

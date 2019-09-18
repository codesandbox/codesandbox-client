import { ILinkProps } from '../Link';

export { Button } from './Button';
export { buttonStyles, ButtonIcon } from './elements';

export interface IBaseProps {
  disabled?: boolean;
  secondary?: boolean;
  danger?: boolean;
  red?: boolean;
  block?: boolean;
  large?: boolean;
}
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

import React, { FunctionComponent } from 'react';

import { LinkButton, AButton, Button } from './elements';

export type Props = {
  to?: string;
  href?: string;
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
};

const ButtonComponent: FunctionComponent<Props> = ({
  style = {},
  ...props
}) => {
  // Link
  if (props.to) {
    return <LinkButton {...props} style={style} />;
  }

  if (props.href) {
    return <AButton {...props} style={style} />;
  }

  return <Button {...props} style={style} />;
};

export { ButtonComponent as Button };

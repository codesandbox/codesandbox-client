import React, { FunctionComponent } from 'react';

import { LinkButton, AButton, ReakitButton, styles } from './elements';

type Props = {
  to?: string;
  href?: string;
  big?: boolean;
  small?: boolean;
  style?: React.CSSProperties;
  block?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  disabled?: boolean;
  type?: 'button' | 'reset' | 'submit';
  danger?: boolean;
  secondary?: boolean;
  red?: boolean;
  target?: string;
  rel?: string;
};
const Button: FunctionComponent<Props> = ({ style = {}, ...props }) => {
  // Link
  if (typeof props.to === 'string') {
    // @ts-ignore
    return <LinkButton {...props} style={style} to={props.to} />;
  }

  if (props.href) {
    // @ts-ignore
    return <AButton {...props} style={style} />;
  }

  // @ts-ignore
  return <ReakitButton {...props} style={style} />;
};

export { Button, styles as buttonStyles };

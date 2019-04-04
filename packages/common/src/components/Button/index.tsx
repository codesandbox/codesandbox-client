import React from 'react';
import { LinkButton, AButton, Button } from './elements';

type Props = {
  to?: string;
  href?: string;
  small?: boolean;
  style?: React.CSSProperties;
  block?: boolean;
  onClick?: () => void;
  children?: React.ReactElement | string;
  disabled?: boolean;
  type?: string;
  secondary?: boolean;
};

function ButtonComponent({ style = {}, ...props }: Props) {
  // Link
  if (props.to) {
    return <LinkButton style={style} {...props} />;
  }

  if (props.href) {
    return <AButton style={style} {...props} />;
  }

  return <Button style={style} {...props} />;
}

export { ButtonComponent as Button };

import React from 'react';
import { LinkButton, AButton, Button } from './elements';

type Props = {
  [key: any]: any,
  to?: string,
  href?: string,
  small?: boolean,
  style?: any,
  block?: boolean,
  onClick?: () => void,
  children?: React.ReactChildren | string,
  disabled?: boolean,
  type?: string,
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

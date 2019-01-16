import React from 'react';
import { LinkButton, AButton, Button } from './elements';

type Props = {
  [key: any]: any,
  to: ?string,
  href: ?string,
  small: ?boolean,
  style: ?any,
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

export default ButtonComponent;

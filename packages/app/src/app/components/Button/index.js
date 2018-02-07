import React from 'react';
import { LinkButton, AButton, Button } from './elements';

type Props = {
  [key: any]: any,
  to: ?string,
  href: ?string,
  small: ?boolean,
  style: ?any,
};

function ButtonComponent({ small = false, style = {}, ...props }: Props) {
  const newStyle = {
    ...style,
    ...(small
      ? {
          padding: '0.5em 0.75em',
          fontSize: '0.875em',
        }
      : {
          padding: '0.65em 2.25em',
        }),
  };

  // Link
  if (props.to) {
    return <LinkButton style={newStyle} {...props} />;
  }

  if (props.href) {
    return <AButton style={newStyle} {...props} />;
  }

  return <Button style={newStyle} {...props} />;
}

export default ButtonComponent;

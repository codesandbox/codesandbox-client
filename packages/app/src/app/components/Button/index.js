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
          padding: '0.5rem 0.75rem',
          fontSize: '0.875rem',
        }
      : {
          padding: '0.65rem 2.25rem',
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

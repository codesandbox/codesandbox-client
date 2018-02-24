import * as React from 'react';
import { LinkButton, AButton, Button } from './elements';

type Props = {
  to?: string
  href?: string
  small?: boolean
  style?: any
  disabled?: boolean
  onClick?: () => void
  red?: boolean
};

const ButtonComponent: React.StatelessComponent<Props> = ({ small = false, style = {}, ...props }) => {
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

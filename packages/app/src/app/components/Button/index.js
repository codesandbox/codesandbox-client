import React from 'react';
import { LinkButton, AButton, Button } from './elements';

function ButtonComponent(props) {
  // Link
  if (props.to) {
    return <LinkButton {...props} />;
  }

  if (props.href) {
    return <AButton {...props} />;
  }

  return <Button {...props} />;
}

export default ButtonComponent;

import React from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';

export const IconButton = ({ name, ...props }) => (
  <Button
    variant="link"
    css={{
      width: '26px', // same width as (height of the button)
      padding: 0,
      borderRadius: '50%',
      ':hover:not(:disabled)': {
        backgroundColor: 'secondaryButton.background',
      },
      ':focus:not(:disabled)': {
        outline: 'none',
        backgroundColor: 'secondaryButton.background',
      },
    }}
    {...props}
  >
    <Icon name={name} />
  </Button>
);

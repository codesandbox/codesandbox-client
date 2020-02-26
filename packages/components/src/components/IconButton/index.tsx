import React, { ComponentProps, FunctionComponent } from 'react';

import { Button, Icon } from '../..';

type Props = Omit<ComponentProps<typeof Button>, 'children' | 'variant'> &
  Pick<ComponentProps<typeof Icon>, 'name' | 'size'>;
export const IconButton: FunctionComponent<Props> = ({
  name,
  size,
  title,
  ...props
}) => (
  <Button
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
    title={title}
    variant="link"
    {...props}
  >
    <Icon name={name} size={size} />
  </Button>
);

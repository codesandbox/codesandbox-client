// @ts-nocheck
import React from 'react';
import deepmerge from 'deepmerge';
import { Button } from '../Button';
import { Icon, IconNames } from '../Icon';
import { Tooltip } from '../Tooltip';

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** name of the icon */
  name: IconNames;
  /** icon button should have a title for accessibility */
  title: string;
  /** Size of the icon, the button is set to 26x26 */
  size?: number;
};

export const IconButton: React.FC<IconButtonProps> = ({
  name,
  title,
  size,
  css = {},
  ...props
}) => (
  // @ts-ignore
  <Tooltip label={title}>
    <Button
      variant="link"
      css={deepmerge(
        {
          width: '26px', // same width as (height of the button)
          paddingX: 0,
          borderRadius: '50%',
          ':hover:not(:disabled)': {
            backgroundColor: 'secondaryButton.background',
          },
          ':focus:not(:disabled)': {
            outline: 'none',
            backgroundColor: 'secondaryButton.background',
          },
        },
        css
      )}
      // @ts-ignore
      {...props}
    >
      <Icon name={name} size={size} />
    </Button>
  </Tooltip>
);

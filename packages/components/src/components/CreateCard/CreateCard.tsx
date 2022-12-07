import React from 'react';
import { Icon, IconNames } from '../Icon';
import { Stack } from '../Stack';
import { Text } from '../Text';

type StackProps = React.ComponentProps<typeof Stack>;

type CreateCardProps = {
  icon: IconNames;
  label: string;
} & StackProps;

export const CreateCard: React.FC<CreateCardProps> = ({
  as = 'button',
  icon,
  label,
  ...props
}) => {
  return (
    <Stack
      as={as}
      css={{
        position: 'relative',
        overflow: 'hidden',
        maxWidth: '276px',
        padding: '24px',
        flex: 1,
        justifyContent: 'space-between',
        border: '1px solid',
        borderColor: 'transparent',
        borderRadius: '4px',
        backgroundColor: '#161616',
        outline: 'none',
        textDecoration: 'none',
        transition: 'background ease-in-out, opacity ease-in-out',
        transitionDuration: theme => theme.speeds[2],
        '&:hover, &:active': {
          backgroundColor: 'card.backgroundHover',
        },
        '&:focus-visible': {
          borderColor: 'focusBorder',
        },
      }}
      direction="vertical"
      gap={4}
      {...props}
    >
      <Icon color="#999999" name={icon} size={20} />
      <Text
        css={{
          width: '100%',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
        color="#EBEBEB"
        lineHeight="16px"
        size={13}
        weight="medium"
      >
        {label}
      </Text>
    </Stack>
  );
};

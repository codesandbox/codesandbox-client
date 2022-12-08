import React from 'react';
import { Icon, IconNames } from '../Icon';
import { Stack } from '../Stack';
import { Text } from '../Text';

type AnchorProps = { as: 'a' } & React.AnchorHTMLAttributes<HTMLAnchorElement>;
type ButtonProps = { as: 'button' } & React.ButtonHTMLAttributes<
  HTMLButtonElement
>;

type CreateCardProps = {
  icon: IconNames;
  label: string;
} & (AnchorProps | ButtonProps);

export const CreateCard: React.FC<CreateCardProps> = ({
  icon,
  label,
  ...props
}) => {
  return (
    <Stack
      css={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        padding: '24px',
        flex: 1,
        justifyContent: 'space-between',
        border: '1px solid',
        borderColor: 'transparent',
        borderRadius: '4px',
        backgroundColor: '#161616',
        outline: 'none',
        textDecoration: 'none',
        transition: 'background ease-in-out',
        transitionDuration: theme => theme.speeds[2],

        ':hover': {
          backgroundColor: 'card.backgroundHover',
        },

        ':focus-visible': {
          borderColor: 'focusBorder',
        },
      }}
      direction="vertical"
      justify="space-between"
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

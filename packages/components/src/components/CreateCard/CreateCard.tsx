import React from 'react';
import { Icon, IconNames } from '../Icon';
import { Stack } from '../Stack';
import { Text } from '../Text';

type CreateCardProps = {
  icon: IconNames;
  title: string;
  label?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const CreateCard: React.FC<CreateCardProps> = ({
  icon,
  title,
  label,
  ...props
}) => {
  return (
    <Stack
      as="button"
      css={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        padding: '24px',
        fontFamily: 'inherit',
        flex: 1,
        justifyContent: 'space-between',
        border: '1px solid',
        borderColor: 'transparent',
        borderRadius: '4px',
        backgroundColor: '#1D1D1D',
        outline: 'none',
        textDecoration: 'none',
        transition: 'background ease-in-out',
        transitionDuration: theme => theme.speeds[2],

        ':hover': {
          backgroundColor: '#252525',
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
      <Stack css={{ width: '100%' }} direction="vertical" gap={1}>
        {label && label !== '' ? (
          <Text color="#999" size={12}>
            {label}
          </Text>
        ) : null}
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
          {title}
        </Text>
      </Stack>
    </Stack>
  );
};

import React from 'react';
import { Icon, Stack, Text, Link } from '@codesandbox/components';
import css from '@styled-system/css';

interface AlertProps {
  message: string;
  cta?: {
    label: string;
    href: string;
  };
}

export const Alert = (props: AlertProps) => (
  <Stack
    css={css({
      backgroundColor: 'grays.600',
      borderRadius: 'medium',
      height: 9,
      paddingX: 3,
    })}
    gap={4}
    align="center"
  >
    <Icon size={16} name="info" />
    <Text css={css({ width: '100%' })} color="white" weight="medium" size={2}>
      {props.message}
    </Text>

    {props.cta && (
      <Link
        size={2}
        css={css({
          color: 'blues.600',
          display: 'block',
          minWidth: 'fit-content',
          fontWeight: 'medium',
          paddingRight: 1,
        })}
        target="_blank"
        rel="noreferrer noopener"
        href={props.cta.href}
      >
        {props.cta.label}
      </Link>
    )}
  </Stack>
);

import React from 'react';
import { Icon, Stack, Text, Link } from '@codesandbox/components';
import css from '@styled-system/css';

interface AlertProps {
  message: string;
  upgrade?: boolean;
  cta?: {
    label: string;
    href: string;
    onClick?: () => void;
    newTab?: boolean;
  };
}

export const Alert: React.FC<AlertProps> = ({ message, upgrade, cta }) => (
  <Stack
    css={css({
      backgroundColor: upgrade ? 'white' : 'grays.600',
      borderRadius: 'medium',
      height: 9,
      paddingX: 3,
    })}
    gap={4}
    align="center"
  >
    {!upgrade && <Icon size={16} name="info" />}
    <Text
      css={css({ width: '100%', color: upgrade ? '#151515' : 'white' })}
      weight="medium"
      size={2}
    >
      {message}
    </Text>

    {cta && (
      <Link
        size={2}
        css={css({
          color: 'blues.600',
          display: 'block',
          minWidth: 'fit-content',
          fontWeight: 'medium',
          paddingRight: 1,

          '&:hover, &:focus, &:active': {
            color: 'blues.600',
          },
        })}
        {...(cta.newTab
          ? {
              target: '_blank',
              rel: 'noreferrer noopener',
            }
          : {})}
        href={cta.href}
        onClick={cta.onClick}
      >
        {cta.label}
      </Link>
    )}
  </Stack>
);

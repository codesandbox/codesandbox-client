import React from 'react';
import { useActions } from 'app/overmind';
import { Stack, Text, Icon } from '@codesandbox/components';
import css from '@styled-system/css';

export const ImportRepositoryCard: React.FC<{ disabled?: boolean }> = ({
  disabled,
}) => {
  const { openCreateSandboxModal } = useActions();

  return (
    <Stack
      as="button"
      direction="vertical"
      justify="space-between"
      onClick={() => openCreateSandboxModal({ initialTab: 'import' })}
      css={css({
        cursor: disabled ? 'not-allowed' : 'default',
        fontFamily: 'inherit',
        width: '100%',
        height: '100%',
        outline: 'none',
        padding: '24px',
        backgroundColor: 'card.background',
        border: '1px solid',
        borderColor: 'transparent',
        borderRadius: '4px',
        transition: 'background ease-in',
        transitionDuration: theme => theme.speeds[2],
        ':not([disabled]):hover': {
          backgroundColor: 'card.backgroundHover',
        },
        ':focus-visible': {
          borderColor: 'focusBorder',
        },
      })}
      disabled={disabled}
    >
      <Icon color="#999999" name="plus" size={20} />
      <Text color={disabled ? '#999999' : '#e5e5e5'} size={14}>
        Import repository
      </Text>
    </Stack>
  );
};

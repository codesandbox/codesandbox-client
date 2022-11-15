import React from 'react';
import { useActions } from 'app/overmind';
import { Stack, Text, Icon, Element } from '@codesandbox/components';
import css from '@styled-system/css';

export const ImportRepositoryCard: React.FC<{ disabled?: boolean }> = ({
  disabled,
}) => {
  const { openCreateSandboxModal } = useActions();

  return (
    <Element
      as="button"
      onClick={() => openCreateSandboxModal({ initialTab: 'import' })}
      css={css({
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 3,
        fontFamily: 'inherit',
        fontWeight: 'normal',
        color: disabled ? '#999999' : '#808080',
        height: 240,
        outline: 'none',
        backgroundColor: 'card.background',
        border: '1px solid',
        borderColor: 'transparent',
        borderRadius: 'medium',
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
      <Stack
        direction="vertical"
        align="center"
        gap={4}
        css={disabled ? { opacity: 0.4 } : undefined}
      >
        <Icon name="plus" size={32} />
        <Text>Import repository</Text>
      </Stack>
    </Element>
  );
};

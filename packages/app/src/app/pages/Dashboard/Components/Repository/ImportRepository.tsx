import React from 'react';
import { useActions } from 'app/overmind';
import { Stack, Text, Icon, Element } from '@codesandbox/components';
import css from '@styled-system/css';

export const ImportRepositoryCard: React.FC = () => {
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
        fontSize: 4,
        fontFamily: 'inherit',
        fontWeight: 'normal',
        color: '#e5e5e5',
        height: 240,
        outline: 'none',
        backgroundColor: 'card.background',
        border: '1px solid',
        borderColor: 'transparent',
        borderRadius: 'medium',
        transition: 'background ease-in',
        transitionDuration: theme => theme.speeds[2],
        ':hover': {
          backgroundColor: 'card.backgroundHover',
        },
        ':focus-visible': {
          borderColor: 'focusBorder',
        },
      })}
    >
      <Stack direction="vertical" align="center" gap={4}>
        <Icon name="plus" size={32} />
        <Text>Import repository</Text>
      </Stack>
    </Element>
  );
};

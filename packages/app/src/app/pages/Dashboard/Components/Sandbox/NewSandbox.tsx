import React from 'react';
import { useActions } from 'app/overmind';
import { Stack, Text, Button, Icon } from '@codesandbox/components';
import css from '@styled-system/css';
import track from '@codesandbox/common/lib/utils/analytics';

interface NewSandboxProps {
  collectionId?: string;
}

export const NewSandbox: React.FC<NewSandboxProps> = props => {
  const { openCreateSandboxModal } = useActions();

  const onClick = () => {
    track('Dashboard - Click Create New', {
      codesandbox: 'V1',
      event_source: 'UI',
    });

    openCreateSandboxModal({ collectionId: props.collectionId });
  };
  return (
    <Button
      variant="link"
      onClick={onClick}
      css={css({
        height: 240,
        fontSize: 3,
        backgroundColor: 'card.background',
        border: '1px solid',
        borderColor: 'transparent',
        borderRadius: 'medium',
        transition: 'background ease-in',
        fontWeight: 'normal',
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
        <Text>New</Text>
      </Stack>
    </Button>
  );
};

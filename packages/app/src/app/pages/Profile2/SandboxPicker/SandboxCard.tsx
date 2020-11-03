import React from 'react';
import { useOvermind } from 'app/overmind';
import {
  Stack,
  Text,
  Stats,
  Icon,
  IconButton,
  SkeletonText,
  isMenuClicked as isTargetInMenu,
} from '@codesandbox/components';
import designLanguage from '@codesandbox/components/lib/design-language/theme';
import css from '@styled-system/css';
import { Sandbox } from '@codesandbox/common/lib/types';
import { SandboxFragmentDashboardFragment } from 'app/graphql/types';

const PrivacyIcons = {
  0: () => null,
  1: () => <Icon name="link" size={12} />,
  2: () => <Icon name="lock" size={12} />,
};

export const SandboxCard: React.FC<{
  sandbox: Sandbox | SandboxFragmentDashboardFragment;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}> = ({ sandbox, onClick }) => {
  const {
    state: {
      profile: { contextMenu },
    },
    actions: {
      profile: { openContextMenu },
    },
  } = useOvermind();

  const onCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isTargetInMenu(event)) return;
    onClick(event);
  };

  const onContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    openContextMenu({
      sandboxId: sandbox.id,
      position: { x: event.clientX, y: event.clientY },
    });
  };

  const PrivacyIcon = PrivacyIcons[sandbox.privacy || 0];

  return (
    <Stack
      direction="vertical"
      gap={4}
      tabIndex={0}
      onClick={onCardClick}
      onContextMenu={onContextMenu}
      css={css({
        backgroundColor: 'grays.700',
        border: '1px solid',
        borderColor:
          contextMenu.sandboxId === sandbox.id ? 'blues.600' : 'grays.600',
        borderRadius: 'medium',
        cursor: 'pointer',
        overflow: 'hidden',
        ':hover, :focus, :focus-within': {
          boxShadow: (theme: typeof designLanguage) =>
            '0 4px 16px 0 ' + theme.colors.grays[900],
        },
        ':focus, :focus-within': {
          outline: 'none',
          borderColor: 'blues.600',
        },
      })}
    >
      <div
        css={css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 160 + 1,
          borderBottom: '1px solid',
          backgroundColor: 'grays.600',
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          borderColor: 'grays.600',
        })}
        style={{
          backgroundImage: `url(${
            sandbox.screenshotUrl ||
            `/api/v1/sandboxes/${sandbox.id}/screenshot.png`
          })`,
        }}
      />
      <Stack justify="space-between">
        <Stack
          direction="vertical"
          marginX={4}
          marginBottom={4}
          css={{ width: '100%' }}
        >
          <Stack gap={1} align="center" css={css({ height: 7 })}>
            <PrivacyIcon />
            <Text size={3} maxWidth="calc(100% - 24px)">
              {sandbox.title || sandbox.alias || sandbox.id}
            </Text>
          </Stack>
          <Stats sandbox={sandbox} css={css({ svg: { size: '14px' } })} />
        </Stack>
        <IconButton
          name="more"
          size={9}
          title="Sandbox actions"
          onClick={onContextMenu}
        />
      </Stack>
    </Stack>
  );
};

export const SkeletonCard = () => (
  <div>
    <Stack
      direction="vertical"
      gap={4}
      css={css({
        backgroundColor: 'grays.700',
        border: '1px solid',
        borderColor: 'grays.600',
        borderRadius: 'medium',
      })}
    >
      <SkeletonText
        css={css({
          width: '100%',
          height: 160 + 1,
          borderBottom: '1px solid',
          borderColor: 'grays.600',
        })}
      />
      <Stack direction="vertical" gap={2} marginX={4} marginBottom={5}>
        <SkeletonText />
        <SkeletonText />
      </Stack>
    </Stack>
  </div>
);

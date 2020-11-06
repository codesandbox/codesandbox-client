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
import { SandboxType } from '../constants';

const PrivacyIcons = {
  0: () => null,
  1: () => <Icon name="link" size={12} />,
  2: () => <Icon name="lock" size={12} />,
};

const privacyToName = {
  0: 'Public',
  1: 'Unlisted',
  2: 'Private',
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

  const PrivacyIcon = PrivacyIcons[sandbox.privacy || 0];
  const isPublic = sandbox.privacy === 0;

  const onCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isTargetInMenu(event)) return;
    if (!isPublic) return;
    onClick(event);
  };

  const onContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    openContextMenu({
      sandboxId: sandbox.id,
      sandboxType: isPublic
        ? SandboxType.PICKER_SANDBOX
        : SandboxType.PRIVATE_SANDBOX,
      position: { x: event.clientX, y: event.clientY },
    });
  };

  return (
    <Stack
      direction="vertical"
      gap={4}
      tabIndex={0}
      onClick={onCardClick}
      onContextMenu={onContextMenu}
      css={css({
        position: 'relative',

        backgroundColor: 'grays.700',
        border: '1px solid',
        borderColor:
          contextMenu.sandboxId === sandbox.id ? 'blues.600' : 'grays.600',
        borderRadius: 'medium',
        cursor: isPublic ? 'pointer' : 'default',
        overflow: 'hidden',
        ':hover, :focus, :focus-within': {
          boxShadow: (theme: typeof designLanguage) =>
            '0 4px 16px 0 ' + theme.colors.grays[900],
          '[data-group-hover]': {
            opacity: 1,
          },
        },
        ':focus, :focus-within': {
          outline: 'none',
          borderColor: 'blues.600',
        },
      })}
    >
      {!isPublic && (
        <Stack
          align="center"
          css={css({
            position: 'absolute',
            zIndex: 2,
            width: '100%',
            height: 160 + 1, // match thumbnail height
            padding: 4,
            backgroundColor: (theme: typeof designLanguage) =>
              theme.colors.grays[500] + '40',
          })}
        >
          <Text
            size={3}
            align="center"
            data-group-hover
            css={css({
              color: 'white',
              width: '100%',
              opacity: 0,
              textShadow: '1px 1px 2px #00000080',
            })}
          >
            {privacyToName[sandbox.privacy]} sandboxes cannot
            <br /> be featured on profile
          </Text>
          <Stack
            justify="center"
            align="center"
            css={css({
              position: 'absolute',
              top: 2,
              right: 2,
              size: 6,
              backgroundColor: 'grays.500',
              borderRadius: 'medium',
            })}
            onClick={onContextMenu}
          >
            <PrivacyIcon />
          </Stack>
        </Stack>
      )}
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
          opacity: isPublic ? 1 : 0.4,
        })}
        style={{
          backgroundImage: `url(${
            sandbox.screenshotUrl ||
            `/api/v1/sandboxes/${sandbox.id}/screenshot.png`
          })`,
        }}
      />
      <Stack
        data-group-hover
        justify="space-between"
        css={{ opacity: isPublic ? 1 : 0.4 }}
      >
        <Stack
          direction="vertical"
          marginX={4}
          marginBottom={4}
          css={{ width: '100%' }}
        >
          <Text size={3} maxWidth="calc(100% - 24px)" css={css({ height: 7 })}>
            {sandbox.title || sandbox.alias || sandbox.id}
          </Text>
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

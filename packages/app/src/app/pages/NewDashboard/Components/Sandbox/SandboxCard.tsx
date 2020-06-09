import React from 'react';
import {
  Stack,
  Element,
  Text,
  Stats,
  Input,
  IconButton,
  SkeletonText,
} from '@codesandbox/components';
import css from '@styled-system/css';

export const SandboxCard = ({
  sandbox,
  sandboxTitle,
  newTitle,
  TemplateIcon,
  // interactions
  selected,
  onClick,
  onDoubleClick,
  onBlur,
  onKeyDown,
  onContextMenu,
  // editing
  editing,
  onChange,
  onInputKeyDown,
  onSubmit,
  onInputBlur,
  // drag preview
  thumbnailRef,
  opacity,
  ...props
}) => (
  <Stack
    direction="vertical"
    gap={2}
    onClick={onClick}
    onDoubleClick={onDoubleClick}
    onBlur={onBlur}
    onKeyDown={onKeyDown}
    onContextMenu={onContextMenu}
    {...props}
    css={css({
      position: 'relative',
      width: '100%',
      height: 240,
      backgroundColor: 'grays.700',
      border: '1px solid',
      borderColor: selected ? 'blues.600' : 'grays.600',
      borderRadius: 'medium',
      overflow: 'hidden',
      transition: 'all ease-in-out',
      transitionDuration: theme => theme.speeds[4],
      opacity,
      ':hover, :focus, :focus-within': {
        boxShadow: theme => '0 4px 16px 0 ' + theme.colors.grays[900],
      },
    })}
  >
    <Element
      as="div"
      ref={thumbnailRef}
      css={css({
        height: 160,
        backgroundColor: 'grays.600',
        backgroundImage: `url(${sandbox.screenshotUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      })}
    />
    <Element
      css={css({
        position: 'absolute',
        top: 1,
        right: 1,
        size: 6,
        background: 'white',
        border: '4px solid',
        borderColor: 'grays.500',
        borderRadius: 'medium',
      })}
    >
      <TemplateIcon width="16" height="16" />
    </Element>
    <Stack justify="space-between" align="center" marginLeft={4}>
      {editing ? (
        <form onSubmit={onSubmit}>
          <Input
            autoFocus
            value={newTitle}
            onChange={onChange}
            onKeyDown={onInputKeyDown}
            onBlur={onInputBlur}
          />
        </form>
      ) : (
        <Text size={3} weight="medium">
          {sandboxTitle}
        </Text>
      )}

      <IconButton
        name="more"
        size={9}
        title="Sandbox actions"
        onClick={onContextMenu}
      />
    </Stack>
    <Stack marginX={4}>
      <Stats
        css={css({ fontSize: 2 })}
        sandbox={{
          viewCount: sandbox.viewCount,
          likeCount: sandbox.likeCount,
          forkCount: sandbox.forkCount,
        }}
      />
    </Stack>
  </Stack>
);

export const SkeletonCard = () => (
  <Stack
    direction="vertical"
    gap={4}
    css={css({
      width: '100%',
      height: 240,
      border: '1px solid',
      borderColor: 'grays.600',
      borderRadius: 'medium',
      overflow: 'hidden',
      transition: 'all ease-in-out',
      transitionDuration: theme => theme.speeds[4],
    })}
  >
    <SkeletonText css={{ width: '100%', height: 160, borderRadius: 0 }} />
    <Stack direction="vertical" gap={2} marginX={4}>
      <SkeletonText css={{ width: 120 }} />
      <SkeletonText css={{ width: 180 }} />
    </Stack>
  </Stack>
);

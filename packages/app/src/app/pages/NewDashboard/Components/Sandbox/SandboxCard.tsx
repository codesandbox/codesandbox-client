import React from 'react';
import {
  Stack,
  Element,
  Text,
  Input,
  Icon,
  IconButton,
  SkeletonText,
} from '@codesandbox/components';
import css from '@styled-system/css';

export const SandboxCard = ({
  sandbox,
  sandboxTitle,
  sandboxLocation,
  lastUpdated,
  viewCount,
  TemplateIcon,
  PrivacyIcon,
  screenshotUrl,
  // interactions
  selected,
  onClick,
  onDoubleClick,
  onBlur,
  onKeyDown,
  onContextMenu,
  // editing
  editing,
  newTitle,
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
    <Stack
      ref={thumbnailRef}
      justify="center"
      align="center"
      css={css({
        height: 160,
        backgroundColor: 'grays.600',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        svg: {
          filter: 'grayscale(1)',
          opacity: 0.1,
        },
      })}
      style={{
        [screenshotUrl ? 'backgroundImage' : null]: `url(${screenshotUrl})`,
      }}
    >
      {screenshotUrl ? null : <TemplateIcon width="60" height="60" />}
    </Stack>
    <Element
      css={css({
        position: 'absolute',
        top: 1,
        right: 1,
        size: 6,
        width: '22px',
        height: '22px',
        backgroundColor: 'grays.500',
        border: '3px solid',
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
        <Stack gap={1} align="center">
          <PrivacyIcon />
          <Text size={3} weight="medium">
            {sandboxTitle}
          </Text>
        </Stack>
      )}

      <IconButton
        name="more"
        size={9}
        title="Sandbox actions"
        onClick={onContextMenu}
      />
    </Stack>
    <Stack marginX={4} gap={2} align="center">
      <Stack gap={1} align="center">
        <Icon name="eye" size={14} css={css({ color: 'mutedForeground' })} />
        <Text size={2} variant="muted">
          {viewCount}
        </Text>
      </Stack>
      {sandbox.isHomeTemplate ? null : (
        <>
          <Text size={2} variant="muted">
            •
          </Text>
          <Text size={2} variant="muted" css={{ flexShrink: 0 }}>
            {shortDistance(lastUpdated)}
          </Text>
        </>
      )}
      {sandboxLocation ? (
        <>
          <Text size={2} variant="muted">
            •
          </Text>
          <Text size={2} variant="muted" maxWidth="100%">
            {sandboxLocation}
          </Text>
        </>
      ) : null}
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
    })}
  >
    <SkeletonText css={{ width: '100%', height: 160, borderRadius: 0 }} />
    <Stack direction="vertical" gap={2} marginX={4}>
      <SkeletonText css={{ width: 120 }} />
      <SkeletonText css={{ width: 180 }} />
    </Stack>
  </Stack>
);

const shortDistance = distance =>
  // we remove long names for short letters
  distance
    .replace(' years', 'y')
    .replace(' year', 'y')
    .replace(' months', 'm')
    .replace(' month', 'm')
    .replace(' days', 'd')
    .replace(' day', 'd')
    .replace(' hours', 'h')
    .replace(' hour', 'h')
    .replace(' minutes', 'min')
    .replace(' minute', 'min')
    .replace(' seconds', 's')
    .replace(' second', 's');

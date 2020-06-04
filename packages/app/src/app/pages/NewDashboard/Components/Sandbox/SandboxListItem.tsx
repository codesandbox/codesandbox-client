import React from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import {
  Grid,
  Column,
  Stack,
  Element,
  Text,
  Input,
  ListAction,
  IconButton,
  SkeletonText,
  Tooltip,
} from '@codesandbox/components';
import css from '@styled-system/css';

export const SandboxListItem = ({
  sandbox,
  sandboxTitle,
  // interactions
  selected,
  onClick,
  onDoubleClick,
  onBlur,
  onKeyDown,
  onContextMenu,
  // edit mode
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
  <ListAction
    align="center"
    onClick={onClick}
    onDoubleClick={onDoubleClick}
    onBlur={onBlur}
    onKeyDown={onKeyDown}
    onContextMenu={onContextMenu}
    {...props}
    css={css({
      paddingX: 0,
      opacity,
      height: 64,
      borderBottom: '1px solid',
      borderBottomColor: 'grays.600',
      overflow: 'hidden',
      backgroundColor: selected ? 'blues.600' : 'transparent',
      color: selected ? 'white' : 'inherit',
      ':hover, :focus, :focus-within': {
        backgroundColor: selected ? 'blues.600' : 'list.hoverBackground',
      },
    })}
  >
    <Grid css={{ width: 'calc(100% - 26px - 8px)' }}>
      <Column span={[12, 5, 5]}>
        <Stack gap={4} align="center" marginLeft={2}>
          <Element
            as="div"
            ref={thumbnailRef}
            css={css({
              borderRadius: 'small',
              height: 32,
              width: 32,
              backgroundImage: `url(${sandbox.screenshotUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              border: '1px solid',
              borderColor: 'grays.600',
              flexShrink: 0,
            })}
          />
          <Element style={{ width: 150 }}>
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
              <Tooltip label={sandboxTitle}>
                <Text size={3} weight="medium" maxWidth="100%">
                  {sandboxTitle}
                </Text>
              </Tooltip>
            )}
          </Element>
        </Stack>
      </Column>
      <Column span={[0, 4, 4]} as={Stack} align="center">
        {sandbox.removedAt ? (
          <Text size={3} variant="muted" maxWidth="100%">
            <Text css={css({ display: ['none', 'none', 'inline'] })}>
              Deleted
            </Text>{' '}
            {formatDistanceToNow(new Date(sandbox.removedAt))} ago
          </Text>
        ) : (
          <Text size={3} variant="muted" maxWidth="100%">
            <Text css={css({ display: ['none', 'none', 'inline'] })}>
              Updated
            </Text>{' '}
            {formatDistanceToNow(new Date(sandbox.updatedAt))} ago
          </Text>
        )}
      </Column>
      <Column span={[0, 3, 3]} as={Stack} align="center">
        <Text size={3} variant="muted" maxWidth="100%">
          {sandbox.source.template}
        </Text>
      </Column>
    </Grid>
    <IconButton
      name="more"
      size={9}
      title="Sandbox actions"
      onClick={onContextMenu}
    />
  </ListAction>
);

export const SkeletonListItem = () => (
  <Stack
    paddingX={2}
    align="center"
    justify="space-between"
    css={css({
      height: 64,
      paddingX: 2,
      borderBottom: '1px solid',
      borderBottomColor: 'grays.600',
    })}
  >
    <Stack align="center" gap={4}>
      <SkeletonText css={{ height: 32, width: 32 }} />
      <SkeletonText css={{ width: 120 }} />
    </Stack>
    <SkeletonText css={{ width: 120 }} />
    <SkeletonText
      css={{
        width: 26,
        /* keep menu for justify, but hide it from user */
        opacity: 0,
      }}
    />
  </Stack>
);

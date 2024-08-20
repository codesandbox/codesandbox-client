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
  Tooltip,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { SandboxItemComponentProps } from './types';
import { SandboxBadge } from './SandboxBadge';

export const SandboxListItem = ({
  sandbox,
  sandboxTitle,
  sandboxLocation,
  username,
  timeAgo,
  viewCount,
  TemplateIcon,
  PrivacyIcon,
  screenshotUrl,
  restricted,
  // interactions
  selected,
  onClick,
  onDoubleClick,
  onBlur,
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
  isDragging,
  ...props
}: SandboxItemComponentProps) => (
  <ListAction
    align="center"
    css={css({
      paddingX: 0,
      opacity: isDragging ? 0.25 : 1,
      height: 64,
      borderBottom: '1px solid',
      borderBottomColor: 'grays.600',
      overflow: 'hidden',
      backgroundColor: selected ? 'purpleOpaque' : 'transparent',
      color: selected ? 'white' : 'inherit',
      ':hover, :focus, :focus-within': {
        cursor: 'default',
        backgroundColor: selected ? 'purpleOpaque' : 'list.hoverBackground',
      },
      ':has(button:hover), :has(button:focus-visible)': {
        backgroundColor: 'transparent',
      },
    })}
  >
    <Element
      css={css({
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        outline: 'none',
      })}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onBlur={onBlur}
      onContextMenu={onContextMenu}
      {...props}
    >
      <Grid css={{ width: 'calc(100% - 26px - 8px)' }} columnGap={4}>
        <Column
          span={[10, 5, 4]}
          css={{
            display: 'block',
            overflow: 'hidden',
            paddingBottom: 4,
            paddingTop: 4,
          }}
        >
          <Stack gap={4} align="center" marginLeft={2}>
            <Stack
              as="div"
              ref={thumbnailRef}
              justify="center"
              align="center"
              css={css({
                borderRadius: 'small',
                height: 32,
                width: 32,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: 'grays.700',
                flexShrink: 0,
                position: 'relative',
                svg: {
                  filter: 'grayscale(1)',
                  opacity: 0.1,
                },
              })}
              style={{
                [screenshotUrl
                  ? 'backgroundImage'
                  : null]: `url(${screenshotUrl})`,
              }}
            >
              {screenshotUrl ? null : <TemplateIcon width="16" height="16" />}
            </Stack>
            <Element css={{ overflow: 'hidden' }}>
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
                  <Stack gap={1} align="center">
                    <PrivacyIcon />
                    <Text
                      size={3}
                      weight="medium"
                      maxWidth="100%"
                      css={{
                        color: restricted ? '#999999' : '#E5E5E5',
                      }}
                    >
                      {sandboxTitle}
                    </Text>
                  </Stack>
                </Tooltip>
              )}
            </Element>
          </Stack>
        </Column>
        {/* Column span 0 on mobile because the Grid is bugged */}
        <Column span={[0, 2, 2]}>
          <Stack align="center">
            <SandboxBadge sandbox={sandbox} restricted={restricted} />
          </Stack>
        </Column>
        <Column span={[0, 3, 3]} as={Stack} align="center">
          {sandbox.removedAt ? (
            <Text
              size={3}
              variant={selected ? 'body' : 'muted'}
              maxWidth="100%"
            >
              <Text css={css({ display: ['none', 'none', 'inline'] })}>
                deleted
              </Text>{' '}
              {formatDistanceToNow(
                new Date(sandbox.removedAt.replace(/ /g, 'T'))
              )}{' '}
              ago
            </Text>
          ) : (
            <Text
              size={3}
              variant={selected ? 'body' : 'muted'}
              maxWidth="100%"
            >
              {timeAgo} {username ? `by ${username}` : ''}
            </Text>
          )}
        </Column>
        <Column span={[0, 2, 3]} as={Stack} align="center">
          <Text size={3} variant={selected ? 'body' : 'muted'} maxWidth="100%">
            {sandboxLocation}
          </Text>
        </Column>
      </Grid>
      <IconButton
        name="more"
        variant="square"
        size={14}
        title="Sandbox actions"
        onClick={onContextMenu}
      />
    </Element>
  </ListAction>
);

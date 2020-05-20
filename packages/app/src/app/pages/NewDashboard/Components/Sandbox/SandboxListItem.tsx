import React from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import {
  Stack,
  Element,
  Text,
  Input,
  ListAction,
  SkeletonText,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { MenuOptions } from './Menu';

export const SandboxListItem = ({
  sandbox,
  isTemplate = false,
  sandboxTitle,
  newTitle,
  // interactions
  selection,
  onClick,
  onDoubleClick,
  onBlur,
  onKeyDown,
  // edit mode
  edit,
  inputRef,
  onChange,
  onInputKeyDown,
  onSubmit,
  onInputBlur,
  enterEditing,
  // drag preview
  thumbnailRef,
  opacity,
  ...props
}) => (
  <ListAction
    css={css({ paddingX: 0, opacity })}
    onClick={onClick}
    onDoubleClick={onDoubleClick}
    onBlur={onBlur}
    onKeyDown={onKeyDown}
    {...props}
  >
    <Stack
      gap={2}
      justify="space-between"
      align="center"
      paddingX={2}
      css={css({
        height: 64,
        width: '100%',
        borderBottom: '1px solid',
        borderBottomColor: 'grays.600',
        overflow: 'hidden',
        boxShadow: theme =>
          selected ? `0px 0px 1px 1px ${theme.colors.blues[600]}` : null,
      })}
    >
      <Stack gap={4} align="center">
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
          })}
        />
        <Element style={{ width: 150 }}>
          {edit ? (
            <form onSubmit={onSubmit}>
              <Input
                value={newTitle}
                ref={inputRef}
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
        </Element>
      </Stack>
      {sandbox.removedAt ? (
        <Text size={3} variant="muted" block style={{ width: 180 }}>
          Deleted {formatDistanceToNow(new Date(sandbox.removedAt))} ago
        </Text>
      ) : (
        <Text size={3} variant="muted" block style={{ width: 180 }}>
          Updated {formatDistanceToNow(new Date(sandbox.updatedAt))} ago
        </Text>
      )}
      <MenuOptions
        sandbox={sandbox}
        isTemplate={isTemplate}
        onRename={enterEditing}
      />
    </Stack>
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

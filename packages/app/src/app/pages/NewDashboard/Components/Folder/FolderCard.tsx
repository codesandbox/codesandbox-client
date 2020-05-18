import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, Link, Text, Input } from '@codesandbox/components';
import css from '@styled-system/css';
import { MenuOptions } from './Menu';

export const FolderCard = ({
  name,
  path,
  numberOfSandboxes,
  // editing
  editing,
  enterEditing,
  isNewFolder,
  newName,
  inputRef,
  onChange,
  onKeyDown,
  onSubmit,
  onBlur,
  // drop target
  showDropStyles,
  // drag preview
  thumbnailRef,
  opacity,
  // menu conflict
  onClick,
  ...props
}) => (
  <Link
    as={RouterLink}
    to={`/new-dashboard/all` + path}
    onClick={onClick}
    {...props}
  >
    <Stack
      direction="vertical"
      gap={2}
      css={css({
        width: '100%',
        height: 240,
        backgroundColor: 'grays.700',
        border: '1px solid',
        borderRadius: 'medium',
        overflow: 'hidden',
        transition: 'all ease-in-out',
        transitionDuration: theme => theme.speeds[4],
        // drop target
        borderColor: showDropStyles ? 'grays.400' : 'grays.500',
        boxShadow: theme =>
          showDropStyles ? '0 4px 16px 0 ' + theme.colors.grays[900] : null,

        // drag state,
        opacity,

        ':hover, :focus, :focus-within': {
          cursor: editing ? 'normal' : 'pointer',
          boxShadow: theme => '0 4px 16px 0 ' + theme.colors.grays[900],
        },
      })}
    >
      <Stack
        as="div"
        justify="center"
        align="center"
        ref={thumbnailRef}
        css={css({
          height: 160,
          borderStyle: 'solid',
          borderWidth: 0,
          borderBottomWidth: 1,
          borderColor: 'grays.500',
          backgroundColor: 'grays.600',
        })}
      >
        <svg width={56} height={49} fill="none" viewBox="0 0 56 49">
          <path
            fill="#6CC7F6"
            d="M20.721 0H1.591A1.59 1.59 0 000 1.59v45.82C0 48.287.712 49 1.59 49h52.82A1.59 1.59 0 0056 47.41V7.607a1.59 1.59 0 00-1.59-1.59H28L21.788.41A1.59 1.59 0 0020.72 0z"
          />
        </svg>
      </Stack>
      <Stack justify="space-between" align="center" marginLeft={4}>
        {editing ? (
          <form onSubmit={onSubmit}>
            <Input
              value={newName}
              ref={inputRef}
              onChange={onChange}
              onKeyDown={onKeyDown}
              onBlur={onBlur}
            />
          </form>
        ) : (
          <Text size={3} weight="medium">
            {name}
          </Text>
        )}
        {!isNewFolder ? (
          <MenuOptions path={path} onRename={enterEditing} />
        ) : null}
      </Stack>
      {!isNewFolder ? (
        <Stack marginLeft={4}>
          <Text size={3} block variant="muted">
            {numberOfSandboxes || 0}{' '}
            {numberOfSandboxes === 1 ? 'sandbox' : 'sandboxes'}
          </Text>
        </Stack>
      ) : null}
    </Stack>
  </Link>
);

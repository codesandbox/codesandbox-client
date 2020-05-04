import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import {
  Stack,
  Element,
  Text,
  Input,
  Link,
  isMenuClicked,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { MenuOptions } from './Menu';

export const SandboxItem = ({
  sandbox,
  isTemplate = false,
  sandboxTitle,
  newTitle,
  url,
  edit,
  inputRef,
  onChange,
  onKeyDown,
  onSubmit,
  onBlur,
  enterEditing,
  ...props
}) => (
  <Link
    as={RouterLink}
    to={url}
    onClick={event => {
      if (edit || isMenuClicked(event)) event.preventDefault();
    }}
  >
    <Stack
      gap={2}
      align="center"
      paddingX={2}
      justify="space-between"
      css={css({
        width: '100%',
        height: 64,
        borderBottom: '1px solid',
        borderBottomColor: 'grays.600',
        overflow: 'hidden',
      })}
      {...props}
    >
      <Stack gap={4} align="center">
        <Element
          as="div"
          css={css({
            borderRadius: 'small',
            height: 32,
            width: 32,
            backgroundImage: `url(${sandbox.screenshotUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
          })}
        />
        <Element style={{ width: 150 }}>
          {edit ? (
            <form onSubmit={onSubmit}>
              <Input
                value={newTitle}
                ref={inputRef}
                onChange={onChange}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
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
  </Link>
);

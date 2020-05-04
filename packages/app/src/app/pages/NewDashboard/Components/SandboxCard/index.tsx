import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Stack,
  Element,
  Text,
  Link,
  Stats,
  Input,
  SkeletonText,
  isMenuClicked,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { MenuOptions } from './Menu';

export const SandboxCard = ({
  sandbox,
  isTemplate = false,
  sandboxTitle,
  newName,
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
      direction="vertical"
      gap={2}
      css={css({
        width: '100%',
        height: 240,
        border: '1px solid',
        borderColor: 'grays.600',
        borderRadius: 'medium',
        overflow: 'hidden',
        transition: 'all ease-in-out',
        transitionDuration: theme => theme.speeds[4],
        ':hover, :focus, :focus-within': {
          cursor: edit ? 'normal' : 'pointer',
          boxShadow: theme => '0 4px 16px 0 ' + theme.colors.grays[900],
        },
      })}
      {...props}
    >
      <Element
        as="div"
        css={css({
          height: 160,
          backgroundColor: 'grays.600',
          backgroundImage: `url(${sandbox.screenshotUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        })}
      />
      <Stack justify="space-between" align="center" marginLeft={4}>
        {edit ? (
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
            {sandboxTitle}
          </Text>
        )}
        <MenuOptions
          sandbox={sandbox}
          isTemplate={isTemplate}
          onRename={enterEditing}
        />
      </Stack>
      <Stack marginX={4}>
        <Stats
          css={css({ fontSize: 2 })}
          sandbox={{
            viewCount: kFormatter(sandbox.viewCount),
            likeCount: kFormatter(sandbox.likeCount),
            forkCount: kFormatter(sandbox.forkCount),
          }}
        />
      </Stack>
    </Stack>
  </Link>
);

const kFormatter = (num: number): string => {
  if (num > 999999) {
    return (num / 1000000).toFixed(1) + 'M';
  }

  if (num > 999) {
    return (num / 1000).toFixed(1) + 'K';
  }

  return num.toString();
};

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
    <SkeletonText css={{ width: '100%', height: 160 }} />
    <Stack direction="vertical" gap={2} marginX={4}>
      <SkeletonText css={{ width: 120 }} />
      <SkeletonText css={{ width: 180 }} />
    </Stack>
  </Stack>
);

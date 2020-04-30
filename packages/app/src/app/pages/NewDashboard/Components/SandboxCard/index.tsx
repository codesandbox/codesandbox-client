import React, { useState, KeyboardEvent, ChangeEvent, BlurEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import {
  Stack,
  Element,
  Text,
  Stats,
  Input,
  SkeletonText,
  isMenuClicked,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { MenuOptions } from './Menu';

export const SandboxCard = ({ sandbox, isTemplate = false, ...props }) => {
  const sandboxTitle = sandbox.title || sandbox.alias || sandbox.id;
  const { actions } = useOvermind();
  const [edit, setEdit] = useState(false);
  const [newName, setNewName] = useState(sandboxTitle);
  const history = useHistory();

  const url = sandboxUrl({
    id: sandbox.id,
    alias: sandbox.alias,
  });

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === ESC) {
      // Reset value and exit without saving
      setNewName(sandboxTitle);
      setEdit(false);
    }
  };

  const onSubmit = async (event: BlurEvent<HTMLInputElement>) => {
    event.preventDefault();
    await actions.dashboard.renameSandbox({
      id: sandbox.id,
      title: newName,
      oldTitle: sandboxTitle,
    });
    setEdit(false);
  };

  const inputRef = React.useRef(null);
  const enterEditing = () => {
    setEdit(true);
    // Menu defaults to sending focus back to Menu Button
    // Send focus to input in the next tick
    // after menu is done closing.
    setTimeout(() => inputRef.current.focus());
  };

  return (
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
          transform: 'scale(0.98)',
        },
      })}
      {...props}
      onClick={event => {
        if (edit || isMenuClicked(event)) return;
        history.push(url);
      }}
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
              onBlur={onSubmit}
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
  );
};

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

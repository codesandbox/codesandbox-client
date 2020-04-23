import React, { useState } from 'react';
import { Stack, Element, Text, Stats, Input } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { MenuOptions } from './Menu';

type Props = {
  sandbox: any;
  template?: boolean;
  style?: any;
};

export const SandboxCard = ({ sandbox, template, ...props }: Props) => {
  const sandboxTitle = sandbox.title || sandbox.alias || sandbox.id;
  const { actions } = useOvermind();
  const [edit, setEdit] = useState(false);
  const [newName, setNewName] = useState(sandboxTitle);

  const editSandboxTitle = async e => {
    e.preventDefault();
    await actions.dashboard.renameSandbox({
      id: sandbox.id,
      title: newName,
    });
    setEdit(false);
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
        ':hover, :focus': {
          transform: 'scale(0.98)',
        },
      })}
      {...props}
    >
      <Element
        as="div"
        css={{
          height: 160,
          backgroundImage: `url(${sandbox.screenshotUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <Stack justify="space-between" align="center" marginLeft={4}>
        {edit ? (
          <form onSubmit={editSandboxTitle}>
            <Input value={newName} onChange={e => setNewName(e.target.value)} />
          </form>
        ) : (
          <Text size={3} weight="medium">
            {sandboxTitle}
          </Text>
        )}
        <MenuOptions sandbox={sandbox} template={template} setEdit={setEdit} />
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

import React, { useState } from 'react';
import { Stack, Element, Text, Input } from '@codesandbox/components';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { MenuOptions } from './Menu';

type Props = {
  sandbox: any;
  template?: boolean;
  style?: any;
};

export const SandboxItem = ({ sandbox, template, ...props }: Props) => {
  const sandboxTitle = sandbox.title || sandbox.alias || sandbox.id;
  const { actions } = useOvermind();
  const [edit, setEdit] = useState(false);
  const [newName, setNewName] = useState(sandboxTitle);

  const editSandboxTitle = async e => {
    e.preventDefault();
    await actions.dashboard.renameSandbox({
      id: sandbox.id,
      title: newName,
      oldTitle: sandboxTitle,
    });
    setEdit(false);
  };

  return (
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
            <form onSubmit={editSandboxTitle}>
              <Input
                value={newName}
                onChange={e => setNewName(e.target.value)}
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
      <MenuOptions sandbox={sandbox} template={template} setEdit={setEdit} />
    </Stack>
  );
};

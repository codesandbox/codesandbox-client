import React, { useState } from 'react';
import { Link as LinkBase } from 'react-router-dom';
import { Stack, Text, Input, Link } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { join, dirname } from 'path';
import { MenuOptions } from './Menu';

type Props = {
  name: string;
  path: string;
};

export const FolderCard = ({ name, path, ...props }: Props) => {
  const { actions } = useOvermind();
  const [edit, setEdit] = useState(false);
  const [newName, setNewName] = useState(name);

  const editFolderName = async e => {
    e.preventDefault();
    await actions.dashboard.renameFolder({
      path,
      newPath: join(dirname(path), newName),
      name: newName,
    });
    setEdit(false);
  };

  return (
    <Link as={LinkBase} to={`/new-dashboard/all` + path}>
      <Stack
        direction="vertical"
        gap={2}
        css={css({
          width: '100%',
          height: 240,
          border: '1px solid',
          borderColor: 'grays.500',
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
        <Stack
          as="div"
          justify="center"
          align="center"
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
          {edit ? (
            <form onSubmit={editFolderName}>
              <Input
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
            </form>
          ) : (
            <Text size={3} weight="medium" paddingTop={2}>
              {name}
            </Text>
          )}
          <MenuOptions path={path} setEdit={setEdit} />
        </Stack>
      </Stack>
    </Link>
  );
};

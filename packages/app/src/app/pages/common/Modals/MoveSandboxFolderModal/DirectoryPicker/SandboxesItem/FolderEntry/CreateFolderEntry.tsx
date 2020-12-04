import React from 'react';
import { useOvermind } from 'app/overmind';
import { join } from 'path';

import AddFolderIcon from 'react-icons/lib/md/create-new-folder';
import Input from '@codesandbox/common/lib/components/Input';
import track from '@codesandbox/common/lib/utils/analytics';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';

import {
  CreateDirectoryContainer,
  IconContainer,
  AnimatedChevron,
} from './elements';

interface Props {
  basePath: string;
  close: () => void;
  depth: number;
  noFocus?: boolean;
}

export const CreateFolderEntry = ({
  basePath,

  noFocus,
  close,
  depth,
}: Props) => {
  const { actions } = useOvermind();
  let input;

  const createFolder = async e => {
    e.preventDefault();
    const path = join(basePath || '/', input.value);
    track('Dashboard - Create Directory', {
      path,
    });
    actions.dashboard.createFolder(path);
    input.value = '';
    close();
  };

  return (
    <form onSubmit={createFolder}>
      <CreateDirectoryContainer depth={depth + 1}>
        <IconContainer style={{ marginRight: '0.25rem' }}>
          <AnimatedChevron open={false} />
          <AddFolderIcon />
        </IconContainer>{' '}
        <Input
          placeholder="Folder Name"
          style={{ marginRight: '1rem' }}
          onBlur={close}
          onKeyDown={e => {
            if (e.keyCode === ESC) {
              e.preventDefault();
              close();
            }
          }}
          ref={el => {
            if (el) {
              if (!noFocus) {
                el.focus();
                el.select();
              }
              input = el;
            }
          }}
          block
        />
      </CreateDirectoryContainer>
    </form>
  );
};

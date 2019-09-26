import { Button } from '@codesandbox/common/lib/components/Button';
import Input from '@codesandbox/common/lib/components/Input';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import track from '@codesandbox/common/lib/utils/analytics';
import { useOvermind } from 'app/overmind';
import React from 'react';
import {
  WorkspaceSubtitle,
  WorkspaceInputContainer,
} from 'app/pages/Sandbox/Editor/Workspace/elements';
import { Error } from './elements';

interface ICreateRepoProps {
  style?: React.CSSProperties;
}

export const CreateRepo: React.FC<ICreateRepoProps> = ({ style }) => {
  const {
    state: {
      editor: { isAllModulesSynced },
      git: { repoTitle, error },
    },
    actions: {
      git: { repoTitleChanged, createRepoClicked },
    },
  } = useOvermind();

  const updateRepoTitle = ({
    target: { value: title },
  }: React.ChangeEvent<HTMLInputElement>) => repoTitleChanged({ title });

  const createRepo = () => {
    track('Export to GitHub Clicked');
    createRepoClicked();
  };

  return (
    <div style={style}>
      {!isAllModulesSynced && (
        <Error>Save your files first before exporting.</Error>
      )}

      {error && <Error>{error}</Error>}

      <WorkspaceSubtitle>Repository Name</WorkspaceSubtitle>

      <WorkspaceInputContainer>
        <Input onChange={updateRepoTitle} value={repoTitle} />
      </WorkspaceInputContainer>

      <Margin horizontal={1} bottom={1}>
        <Button
          block
          disabled={Boolean(error || !repoTitle || !isAllModulesSynced)}
          onClick={createRepo}
          small
        >
          Create Repository
        </Button>
      </Margin>
    </div>
  );
};

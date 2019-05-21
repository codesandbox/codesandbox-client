import React from 'react';
import { observer } from 'mobx-react-lite';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import Input from '@codesandbox/common/lib/components/Input';
import { Button } from '@codesandbox/common/lib/components/Button';
import { useSignals, useStore } from 'app/store';
import {
  WorkspaceSubtitle,
  WorkspaceInputContainer,
} from 'app/pages/Sandbox/Editor/Workspace/elements';
import { Error } from './elements';

export const CreateRepo = observer(
  ({ style }: { style: React.CSSProperties }) => {
    const {
      git: { repoTitleChanged, createRepoClicked },
    } = useSignals();
    const {
      editor: { isAllModulesSynced },
      git: { repoTitle, error },
    } = useStore();

    const updateRepoTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
      repoTitleChanged({ title: e.target.value });
    const createRepo = () => createRepoClicked();

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
            disabled={error || !repoTitle || !isAllModulesSynced}
            onClick={createRepo}
            block
            small
          >
            Create Repository
          </Button>
        </Margin>
      </div>
    );
  }
);

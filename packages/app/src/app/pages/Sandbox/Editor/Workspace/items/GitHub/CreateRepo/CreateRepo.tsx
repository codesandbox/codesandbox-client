import { Button } from '@codesandbox/common/lib/components/Button';
import Input from '@codesandbox/common/lib/components/Input';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { observer } from 'mobx-react-lite';
import React from 'react';

import {
  WorkspaceSubtitle,
  WorkspaceInputContainer,
} from 'app/pages/Sandbox/Editor/Workspace/elements';
import { useSignals, useStore } from 'app/store';

import { Error } from './elements';

type Props = {
  style: React.CSSProperties;
};
export const CreateRepo = observer(({ style }: Props) => {
  const {
    git: { repoTitleChanged, createRepoClicked },
  } = useSignals();
  const {
    editor: { isAllModulesSynced },
    git: { repoTitle, error },
  } = useStore();

  const updateRepoTitle = ({
    target: { value: title },
  }: React.ChangeEvent<HTMLInputElement>) => repoTitleChanged({ title });
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
          block
          disabled={error || !repoTitle || !isAllModulesSynced}
          onClick={createRepo}
          small
        >
          Create Repository
        </Button>
      </Margin>
    </div>
  );
});

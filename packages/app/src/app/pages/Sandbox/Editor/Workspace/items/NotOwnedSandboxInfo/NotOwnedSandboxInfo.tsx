import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useQuery } from '@apollo/react-hooks';
import { MultiAction } from '@codesandbox/common/lib/components/MultiAction';
import { useStore } from 'app/store';
import Dependencies from '../../Dependencies';
import Files from '../../Files';
import { Project } from '../../Project';
import WorkspaceItem from '../../WorkspaceItem';
import { ButtonContainer } from './elements';
import { getSandboxInfo } from './query.gql';

export const NotOwnedSandboxInfo = observer(() => {
  const [editActions, setEditActions] = useState(null); // eslint-disable-line
  const store = useStore();
  console.log(store);
  const id = (store && store.editor && store.editor.currentId) || ``;
  const { data } = useQuery(getSandboxInfo, { variables: { id } });
  console.log(data);
  return (
    <div style={{ marginTop: '1rem' }}>
      <Project />
      <ButtonContainer>
        <MultiAction block small primaryActionLabel="Follow Template">
          <button>Add to Followed Templates</button>
          <button>Add to Team#1 Followed Templates</button>
        </MultiAction>
      </ButtonContainer>
      <WorkspaceItem
        actions={editActions}
        defaultOpen
        style={{ marginTop: '.5rem' }}
        title="Files"
      >
        <Files setEditActions={setEditActions} />
      </WorkspaceItem>
      <WorkspaceItem
        defaultOpen
        style={{ marginTop: '.5rem' }}
        title="Dependencies"
      >
        <Dependencies />
      </WorkspaceItem>
    </div>
  );
});

NotOwnedSandboxInfo.displayName = `NotOwnedSandboxInfo`;

import React from 'react';
import { observer } from 'mobx-react-lite';
import { useSignals, useStore } from 'app/store';
import { LiveInfo } from './LiveInfo';
import { LiveButton } from './LiveButton';
import {
  Description,
  WorkspaceInputContainer,
  WorkspaceSubtitle,
  ErrorDescription,
} from '../../elements';

export const Live = observer(() => {
  const signals = useSignals();
  const store = useStore();
  const hasUnsyncedModules = !store.editor.isAllModulesSynced;

  return (
    <div>
      {store.live.isLive ? (
        <LiveInfo />
      ) : (
        <>
          <Description style={{ marginBottom: '1rem' }}>
            Invite others to live edit this sandbox with you. We
            {"'"}
            re doing it live!
          </Description>
          <>
            <WorkspaceSubtitle>Create live room</WorkspaceSubtitle>
            <Description>
              To invite others you need to generate a URL that others can join.
            </Description>

            {hasUnsyncedModules && (
              <ErrorDescription>
                Save all your files before going live
              </ErrorDescription>
            )}
            <WorkspaceInputContainer>
              <LiveButton
                onClick={() => {
                  signals.live.createLiveClicked({
                    sandboxId: store.editor.currentId,
                  });
                }}
                isLoading={store.live.isLoading}
                disable={hasUnsyncedModules}
              />
            </WorkspaceInputContainer>
          </>
        </>
      )}
    </div>
  );
});

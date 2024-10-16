import hash from '@codesandbox/common/lib/utils/hash';
import * as typeformEmbed from '@typeform/embed';
import React, { FunctionComponent } from 'react';

import { useAppState, useActions } from 'app/overmind';

import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { Alert } from '../Common/Alert';

export const SurveyModal: FunctionComponent = () => {
  const { modalClosed } = useActions();
  const { user } = useAppState();
  const { isPro } = useWorkspaceSubscription();

  const initializeTypeform = (el?: HTMLDivElement) => {
    if (el) {
      typeformEmbed.makeWidget(
        el,
        `https://form.typeform.com/to/LYbjII?userid=${hash(
          user.id
        )}&ispro=${isPro}`,
        {
          opacity: 0,
          hideScrollbars: true,
          hideFooter: true,
          hideHeaders: true,
          onSubmit: () => {
            setTimeout(() => {
              modalClosed();
            }, 3000);
          },
        }
      );
    }
  };

  return (
    <Alert style={{ padding: 0 }}>
      <div style={{ width: '100%', height: 500 }} ref={initializeTypeform} />
    </Alert>
  );
};

import hash from '@codesandbox/common/lib/utils/hash';
import * as typeformEmbed from '@typeform/embed';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { Alert } from '../Common/Alert';

export const SurveyModal: FunctionComponent = () => {
  const {
    actions: { modalClosed },
    state: { isPatron, user },
  } = useOvermind();

  const initializeTypeform = (el?: HTMLDivElement) => {
    if (el) {
      typeformEmbed.makeWidget(
        el,
        `https://codesandbox.typeform.com/to/LYbjII?userid=${hash(
          user.id
        )}&ispatron=${isPatron}`,
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

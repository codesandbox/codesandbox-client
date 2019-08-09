import React from 'react';
import * as typeformEmbed from '@typeform/embed';
import { useStore, useSignals } from 'app/store';
import hash from '@codesandbox/common/lib/utils/hash';

import { Container } from './elements';

export const SurveyModal = () => {
  const store = useStore();
  const signals = useSignals();

  const initializeTypeform = (el: HTMLDivElement) => {
    if (el) {
      typeformEmbed.makeWidget(
        el,
        `https://codesandbox.typeform.com/to/LYbjII?userid=${hash(
          store.user.id
        )}&ispatron=${store.isPatron}`,
        {
          opacity: 0,
          hideScrollbars: true,
          hideFooter: true,
          hideHeaders: true,
          onSubmit: () => {
            setTimeout(() => {
              signals.modalClosed();
            }, 3000);
          },
        }
      );
    }
  };

  return (
    <Container>
      <div style={{ width: '100%', height: 500 }} ref={initializeTypeform} />
    </Container>
  );
};

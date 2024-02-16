import React, { useEffect } from 'react';

import { Stack, Text, Element, Button } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { useActions } from 'app/overmind';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';

import { Container, HeaderInformation } from './elements';
import { LargeCTAButton } from '../dashboard/LargeCTAButton';
import {
  DEVBOX_BUTTON_DESCRIPTION,
  IMPORT_BUTTON_DESCRIPTION,
  SANDBOX_BUTTON_DESCRIPTION,
} from './utils/constants';

export const GenericCreate: React.FC<{
  closeModal?: () => void;
  isModal?: boolean;
}> = ({ closeModal, isModal }) => {
  const actions = useActions();
  const { isFrozen } = useWorkspaceLimits();

  useEffect(() => {
    track('Generic Create - Show', {
      codesandbox: 'V1',
      event_source: 'UI',
    });
  }, []);

  return (
    <Container
      css={{
        height: isModal ? '260px' : '290px',
        '@media screen and (max-width: 750px)': {
          height: 'auto',
        },
      }}
    >
      <Stack
        gap={4}
        align="center"
        css={{
          width: '100%',
          padding: '24px',
          '@media screen and (max-width: 750px)': {
            padding: '16px',
          },
        }}
      >
        <HeaderInformation>
          <Text size={4} variant="muted">
            Create
          </Text>
        </HeaderInformation>
      </Stack>

      <Element
        paddingBottom={6}
        paddingX={6}
        css={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '16px',
          '@media screen and (max-width: 750px)': {
            gridTemplateColumns: '1fr',
          },
        }}
      >
        <LargeCTAButton
          icon="boxRepository"
          disabled={isFrozen}
          title="Import repository"
          subtitle={IMPORT_BUTTON_DESCRIPTION}
          onClick={() => {
            track('Generic Create - Import Repository', {
              codesandbox: 'V1',
              event_source: 'UI',
            });
            if (closeModal) {
              closeModal();
            }
            actions.modalOpened({ modal: 'importRepository' });
          }}
          variant="primary"
          alignment="vertical"
        />

        <LargeCTAButton
          icon="boxDevbox"
          disabled={isFrozen}
          title="Create a Devbox"
          subtitle={DEVBOX_BUTTON_DESCRIPTION}
          onClick={() => {
            track('Generic Create - Create Devbox', {
              codesandbox: 'V1',
              event_source: 'UI',
            });
            if (closeModal) {
              closeModal();
            }
            actions.modalOpened({ modal: 'createDevbox' });
          }}
          variant="primary"
          alignment="vertical"
        />

        <LargeCTAButton
          icon="boxSandbox"
          title="Create a Sandbox"
          subtitle={SANDBOX_BUTTON_DESCRIPTION}
          onClick={() => {
            track('Generic Create - Create Sandbox', {
              codesandbox: 'V1',
              event_source: 'UI',
            });
            if (closeModal) {
              closeModal();
            }
            actions.modalOpened({ modal: 'createSandbox' });
          }}
          variant="secondary"
          alignment="vertical"
        />
      </Element>

      {!isModal && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingBottom: '16px',
          }}
        >
          <Button css={{ width: 'fit-content' }} variant="link" to="/dashboard">
            Go to Dashboard
          </Button>
        </div>
      )}
    </Container>
  );
};

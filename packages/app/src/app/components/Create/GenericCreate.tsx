import React from 'react';

import { Stack, Text, IconButton, Element } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { useActions } from 'app/overmind';
import { Container, HeaderInformation } from './elements';
import { LargeCTAButton } from '../dashboard/LargeCTAButton';

export const GenericCreate: React.FC<{
  closeModal?: () => void;
  isModal?: boolean;
}> = ({ closeModal, isModal }) => {
  const actions = useActions();
  const mediaQuery = window.matchMedia('screen and (max-width: 950px)');
  const mobileScreenSize = mediaQuery.matches;

  return (
    <Container css={{ height: mobileScreenSize ? 'auto' : '260px' }}>
      <Stack
        gap={4}
        align="center"
        css={{
          width: '100%',
          padding: mobileScreenSize ? '16px' : '24px',
        }}
      >
        <HeaderInformation>
          <Text size={4} variant="muted">
            Create
          </Text>
        </HeaderInformation>

        {/* isModal is undefined on /s/ page */}
        {isModal ? (
          <IconButton
            name="cross"
            variant="square"
            size={16}
            title="Close modal"
            onClick={() => closeModal()}
          />
        ) : null}
      </Stack>

      <Element
        paddingBottom={6}
        paddingX={6}
        css={{
          display: 'grid',
          gridTemplateColumns: `repeat(${mobileScreenSize ? 1 : 3}, 1fr)`,
          gap: '16px',
        }}
      >
        <LargeCTAButton
          icon="boxRepository"
          title="Connect a repository"
          subtitle="Run any branch instantly, create and review PRs in our Cloud Development Environment."
          onClick={() => {
            track('Create Modal - Import Repository', {
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
          title="Create a Devbox"
          subtitle="Build and share standalone projects of any size in our Cloud Development Environment."
          onClick={() => {
            track('Create Modal - Create Devbox', {
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
          subtitle="Create simple front-end prototypes for free, running the code your browser."
          onClick={() => {
            track('Create Modal - Create Sandbox', {
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
    </Container>
  );
};

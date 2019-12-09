import { Alert } from 'app/components/Alert';
import Modal from 'app/components/Modal';
import { useOvermind } from 'app/overmind';
import React from 'react';

import {
  PaddedPreference,
  PreferenceContainer,
  SubContainer,
  SubDescription,
  Title,
} from '../../elements';
import { VSCodePlaceholder } from '../../VSCodePlaceholder';

const isSafari: boolean = /^((?!chrome|android).)*safari/i.test(
  navigator.userAgent
);
const isFF: boolean = navigator.userAgent.toLowerCase().includes('firefox');

export const EditorSettings: React.FC = () => {
  const [showModal, setShowModal] = React.useState(false);

  const {
    state: {
      preferences: { settings },
    },
    actions: {
      preferences: { settingChanged },
    },
  } = useOvermind();

  const bindValue = (name: string) => ({
    value: settings[name],
    setValue: (value: any) => {
      settingChanged({ name, value });
      setShowModal(true);
    },
  });

  return (
    <div>
      <Title>Editor</Title>

      <SubContainer>
        <VSCodePlaceholder />

        {/* {Vim mode does not work on FF or Safari */}
        <PreferenceContainer disabled={isSafari || isFF}>
          <PaddedPreference
            title="Enable VIM extension"
            type="boolean"
            {...bindValue('vimMode')}
          />
          <SubDescription>
            Toggling the VIM extension will require a refresh. When enabled, use
            the command palette to control VIM
          </SubDescription>
        </PreferenceContainer>
        {isSafari || isFF ? (
          <SubDescription
            css={`
              margin-top: 0.5rem;
            `}
          >
            The VIM extension currently only works on Chrome and Microsoft Edge.
          </SubDescription>
        ) : null}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          width={400}
        >
          <Alert
            title="Toggle VIM extension"
            body="You need to refresh the browser for this to take effect, do you want to do that now?"
            onCancel={() => setShowModal(false)}
            onConfirm={() => {
              location.reload(true);
            }}
          />
        </Modal>
      </SubContainer>
    </div>
  );
};

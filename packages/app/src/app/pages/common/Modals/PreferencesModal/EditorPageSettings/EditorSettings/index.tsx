import { Alert } from 'app/components/Alert';
import Modal from 'app/components/Modal';
import { useOvermind } from 'app/overmind';
import React from 'react';
import { Text, Element } from '@codesandbox/components';
import { Preference } from '@codesandbox/common/lib/components/Preference';

import { PreferenceContainer } from '../../elements';
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
    <>
      <Text size={4} marginBottom={6} block variant="muted" weight="bold">
        Appearance
      </Text>

      <Element>
        <VSCodePlaceholder />

        {/* {Vim mode does not work on FF or Safari */}
        <Element marginTop={4}>
          <PreferenceContainer disabled={isSafari || isFF}>
            <Preference
              title="Enable VIM extension"
              type="boolean"
              {...bindValue('vimMode')}
            />
            <Text
              marginTop={2}
              block
              size={2}
              variant="muted"
              style={{ maxWidth: '60%', lineHeight: 1.5 }}
            >
              Toggling the VIM extension will require a refresh. When enabled,
              use the command palette to control VIM
            </Text>
          </PreferenceContainer>
        </Element>
        {isSafari || isFF ? (
          <Text size={2} variant="muted" marginBottom={2} block marginTop={2}>
            The VIM extension currently only works on Chrome and Microsoft Edge.
          </Text>
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
      </Element>
    </>
  );
};

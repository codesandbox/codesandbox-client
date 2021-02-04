import { Preference } from '@codesandbox/common/lib/components/Preference';
import { Text, Element } from '@codesandbox/components';
import React, { FunctionComponent, useState } from 'react';

import Modal from 'app/components/Modal';
import { useAppState, useActions } from 'app/overmind';

import { Alert } from '../../Common/Alert';

import { VSCodePlaceholder } from '../VSCodePlaceholder';

import { PreferenceContainer } from '../elements';

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export const EditorSettings: FunctionComponent = () => {
  const { settingChanged } = useActions().preferences;
  const { settings } = useAppState().preferences;
  const [showModal, setShowModal] = useState(false);

  const bindValue = (name: string) => ({
    setValue: (value: any) => {
      settingChanged({ name, value });

      setShowModal(true);
    },
    value: settings[name],
  });

  return (
    <>
      <Text block marginBottom={6} size={4} weight="bold">
        Appearance
      </Text>

      <Element>
        <VSCodePlaceholder />

        {/* {Vim mode does not work on FF or Safari */}
        <Element marginTop={4}>
          <PreferenceContainer disabled={isSafari}>
            <Preference
              title="Enable VIM extension"
              type="boolean"
              {...bindValue('vimMode')}
            />

            <Text
              block
              marginTop={2}
              size={2}
              style={{ maxWidth: '60%', lineHeight: 1.5 }}
              variant="muted"
            >
              Toggling the VIM extension will require a refresh. When enabled,
              use the command palette to control VIM
            </Text>
          </PreferenceContainer>
        </Element>

        {isSafari ? (
          <Text block marginBottom={2} marginTop={2} size={2} variant="muted">
            The VIM extension currently does not work on Safari
          </Text>
        ) : null}

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          width={400}
        >
          <Alert
            description="You need to refresh the browser for this to take effect, do you want to do that now?"
            onCancel={() => setShowModal(false)}
            onPrimaryAction={() => location.reload(true)}
            title="Toggle VIM extension"
          />
        </Modal>
      </Element>
    </>
  );
};

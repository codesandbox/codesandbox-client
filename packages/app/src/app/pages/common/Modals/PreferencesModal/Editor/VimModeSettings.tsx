import { isSafari } from '@codesandbox/common/lib/utils/platform';
import { Preference } from '@codesandbox/common/lib/components/Preference';
import { Settings } from '@codesandbox/common/lib/components/Preview/types';
import { Text } from '@codesandbox/components';
import React, { useState } from 'react';

import Modal from 'app/components/Modal';
import { useAppState, useActions } from 'app/overmind';

import { Alert } from '../../Common/Alert';

import { PreferenceContainer } from '../elements';

const SETTING_NAME: keyof Settings = 'vimMode';

export const VimModeSettings: React.FC = () => {
  const { settingChanged } = useActions().preferences;
  const { settings } = useAppState().preferences;
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  return (
    <>
      <PreferenceContainer disabled={isSafari}>
        <Preference
          title="Enable VIM extension"
          type="boolean"
          setValue={(value: boolean) => {
            settingChanged({ name: SETTING_NAME, value });
            setShowConfirmationModal(true);
          }}
          value={settings[SETTING_NAME]}
        />

        <Text
          block
          marginTop={2}
          size={2}
          style={{ maxWidth: '60%', lineHeight: 1.5 }}
          variant="muted"
        >
          Use the command palette to control VIM
        </Text>
        {/* Vim mode does not work on Safari */}
        {isSafari ? (
          <Text block marginTop={2} size={2} variant="muted">
            The VIM extension currently does not work on Safari
          </Text>
        ) : null}
      </PreferenceContainer>

      <Modal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        width={400}
      >
        <Alert
          description="You need to refresh the browser for this to take effect, do you want to do that now?"
          onCancel={() => setShowConfirmationModal(false)}
          onPrimaryAction={() => location.reload()}
          title="Toggle VIM extension"
        />
      </Modal>
    </>
  );
};

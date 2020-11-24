import codesandbox from '@codesandbox/common/lib/themes/codesandbox.json';
import { ThemeProvider } from '@codesandbox/components';
import {
  COLUMN_MEDIA_THRESHOLD,
  CreateSandbox,
} from 'app/components/CreateNewSandbox/CreateSandbox';
import Modal from 'app/components/Modal';
import { useOvermind } from 'app/overmind';
import getVSCodeTheme from 'app/src/app/pages/Sandbox/Editor/utils/get-vscode-theme';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { AddPreset } from './AddPreset';
import { DeleteDeploymentModal } from './DeleteDeploymentModal';
import { DeletePreset } from './DeletePreset';
import { DeleteProfileSandboxModal } from './DeleteProfileSandboxModal';
import DeleteSandboxModal from './DeleteSandboxModal';
import { DeploymentModal } from './DeploymentModal';
import { EditPresets } from './EditPresets';
import { EmptyTrash } from './EmptyTrash';
import ExportGitHubModal from './ExportGitHubModal';
import { FeedbackModal } from './FeedbackModal';
import { ForkServerModal } from './ForkServerModal';
import { LiveSessionEnded } from './LiveSessionEnded';
import LiveSessionVersionMismatch from './LiveSessionVersionMismatch';
import { NetlifyLogs } from './NetlifyLogs';
import { PickSandboxModal } from './PickSandboxModal';
import { PreferencesModal } from './PreferencesModal';
import { RecoverFilesModal } from './RecoverFilesModal';
import { SandboxPickerModal } from './SandboxPickerModal';
import { SearchDependenciesModal } from './SearchDependenciesModal';
import { SelectSandboxModal } from './SelectSandboxModal';
import { ShareModal } from './ShareModal';
import SignInForTemplates from './SignInForTemplates';
import { StorageManagementModal } from './StorageManagementModal';
import { SurveyModal } from './SurveyModal';
import { TeamInviteModal } from './TeamInviteModal';
import UploadModal from './UploadModal';
import { DeleteWorkspace } from './DeleteWorkspace';
import { MinimumPrivacyModal } from './MinimumPrivacyModal';

const modals = {
  preferences: {
    Component: PreferencesModal,
    width: 900,
  },
  newSandbox: {
    Component: CreateSandbox,
    width: () => (window.outerWidth > COLUMN_MEDIA_THRESHOLD ? 1200 : 950),
  },
  share: {
    Component: ShareModal,
    width: 1200,
  },
  deployment: {
    Component: DeploymentModal,
    width: 600,
  },
  deleteWorkspace: {
    Component: DeleteWorkspace,
    width: 400,
  },
  recoveredFiles: {
    Component: RecoverFilesModal,
    width: 400,
  },
  teamInvite: {
    Component: TeamInviteModal,
    width: 400,
  },
  exportGithub: {
    Component: ExportGitHubModal,
    width: 400,
  },
  signInForTemplates: {
    Component: SignInForTemplates,
    width: 400,
  },
  netlifyLogs: {
    Component: NetlifyLogs,
    width: 750,
  },
  deleteDeployment: {
    Component: DeleteDeploymentModal,
    width: 400,
  },
  deleteSandbox: {
    Component: DeleteSandboxModal,
    width: 400,
  },
  pickSandbox: {
    Component: PickSandboxModal,
    width: 600,
  },
  deleteProfileSandbox: {
    Component: DeleteProfileSandboxModal,
    width: 400,
  },
  deletePreset: {
    Component: DeletePreset,
    width: 400,
  },
  addPreset: {
    Component: AddPreset,
    width: 400,
  },
  editPresets: {
    Component: EditPresets,
    width: 600,
  },
  emptyTrash: {
    Component: EmptyTrash,
    width: 400,
  },
  selectSandbox: {
    Component: SelectSandboxModal,
    width: 600,
  },
  searchDependencies: {
    Component: SearchDependenciesModal,
    width: 716,
  },
  liveSessionEnded: {
    Component: LiveSessionEnded,
    width: 400,
  },
  liveVersionMismatch: {
    Component: LiveSessionVersionMismatch,
    width: 400,
  },
  uploading: {
    Component: UploadModal,
    width: 400,
  },
  storageManagement: {
    Component: StorageManagementModal,
    width: 800,
  },
  forkServerModal: {
    Component: ForkServerModal,
    width: 400,
  },
  feedback: {
    Component: FeedbackModal,
    width: 450,
  },
  userSurvey: {
    Component: SurveyModal,
    width: 850,
  },
  sandboxPicker: {
    Component: SandboxPickerModal,
    width: '90%',
    top: 10, // vh
  },
  minimumPrivacy: {
    Component: MinimumPrivacyModal,
    width: 450,
  },
};

const Modals: FunctionComponent = () => {
  const {
    actions,
    state: {
      preferences: {
        settings: { customVSCodeTheme },
      },
      currentModal,
    },
  } = useOvermind();

  const [localState, setLocalState] = useState({
    theme: {
      colors: {},
      vscodeTheme: codesandbox,
    },
    customVSCodeTheme: null,
  });

  useEffect(() => {
    async function loadTheme() {
      try {
        const t = await getVSCodeTheme('', customVSCodeTheme);
        setLocalState({ theme: t, customVSCodeTheme });
      } catch (e) {
        console.error(e);
      }
    }
    if (localState.customVSCodeTheme !== customVSCodeTheme) {
      loadTheme();
    }
  }, [localState.customVSCodeTheme, customVSCodeTheme]);

  const modal = currentModal && modals[currentModal];

  return (
    <ThemeProvider theme={localState.theme.vscodeTheme}>
      <Modal
        isOpen={Boolean(modal)}
        width={
          modal &&
          (typeof modal.width === 'function' ? modal.width() : modal.width)
        }
        top={modal && modal.top}
        onClose={isKeyDown => actions.modalClosed()}
      >
        {modal
          ? React.createElement(modal.Component, {
              closeModal: () => actions.modalClosed(),
            })
          : null}
      </Modal>
    </ThemeProvider>
  );
};

export { Modals };

import codesandbox from '@codesandbox/common/lib/themes/codesandbox.json';
import { ThemeProvider } from '@codesandbox/components';
import {
  COLUMN_MEDIA_THRESHOLD,
  CreateSandbox,
} from 'app/components/CreateSandbox';
import { useLocation } from 'react-router-dom';
import Modal from 'app/components/Modal';
import { useAppState, useActions } from 'app/overmind';
import getVSCodeTheme from 'app/src/app/pages/Sandbox/Editor/utils/get-vscode-theme';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { AddPreset } from './AddPreset';
import { DeleteDeploymentModal } from './DeleteDeploymentModal';
import { DeletePreset } from './DeletePreset';
import { DeleteProfileSandboxModal } from './DeleteProfileSandboxModal';
import { DeleteSandboxModal } from './DeleteSandboxModal';
import { DeploymentModal } from './DeploymentModal';
import { EditPresets } from './EditPresets';
import { EmptyTrash } from './EmptyTrash';
import { ExportGitHubModal } from './ExportGitHubModal';
import { FeedbackModal } from './FeedbackModal';
import { ForkServerModal } from './ForkServerModal';
import { LiveSessionEnded } from './LiveSessionEnded';
import { LiveSessionRestricted } from './LiveSessionRestricted';
import { LiveVersionMismatch } from './LiveSessionVersionMismatch';
import { NetlifyLogs } from './NetlifyLogs';
import { PickSandboxModal } from './PickSandboxModal';
import { PreferencesModal } from './PreferencesModal';
import { RecoverFilesModal } from './RecoverFilesModal';
import { LegacyPaymentModal } from './LegacyPaymentModal';
import { SandboxPickerModal } from './SandboxPickerModal';
import { SearchDependenciesModal } from './SearchDependenciesModal';
import { SelectSandboxModal } from './SelectSandboxModal';
import { ShareModal } from './ShareModal';
import { SignInForTemplates } from './SignInForTemplates';
import { StorageManagementModal } from './StorageManagementModal';
import { SurveyModal } from './SurveyModal';
import { TeamInviteModal } from './TeamInviteModal';
import { UploadModal } from './UploadModal';
import { DeleteWorkspace } from './DeleteWorkspace';
import { MinimumPrivacyModal } from './MinimumPrivacyModal';
import { GenericAlertModal } from './GenericAlertModal';
import { AccountDeletionModal } from './AccountDeletion';
import { AccountDeletionConfirmationModal } from './AccountDeletion/DeletedConfirmation';
import { UndoAccountDeletionModal } from './UndoAccountDeletion';
import { UndoAccountDeletionConfirmationModal } from './UndoAccountDeletion/UndoDeletedConfirmation';
import { NotFoundBranchModal } from './NotFoundBranchModal';
import { GithubPagesLogs } from './GithubPagesLogs';
import { CropThumbnail } from './CropThumbnail';
import { SubscriptionCancellationModal } from './SubscriptionCancellation';
import { SelectWorkspaceToUpgrade } from './SelectWorkspaceToUpgrade';
import { SelectWorkspaceToStartTrial } from './SelectWorkspaceToStartTrial';

const modals = {
  preferences: {
    Component: PreferencesModal,
    width: 900,
  },
  legacyPayment: {
    Component: LegacyPaymentModal,
    width: 600,
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
  githubPagesLogs: {
    Component: GithubPagesLogs,
    width: 750,
  },
  cropThumbnail: {
    Component: CropThumbnail,
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
  liveSessionRestricted: {
    Component: LiveSessionRestricted,
    width: 400,
  },
  liveVersionMismatch: {
    Component: LiveVersionMismatch,
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
  accountClosing: {
    Component: AccountDeletionModal,
    width: 450,
  },
  undoAccountClosing: {
    Component: UndoAccountDeletionModal,
    width: 450,
  },
  deleteConfirmation: {
    Component: AccountDeletionConfirmationModal,
    width: 450,
  },
  undoDeleteConfirmation: {
    Component: UndoAccountDeletionConfirmationModal,
    width: 450,
  },
  notFoundBranchModal: {
    Component: NotFoundBranchModal,
    width: 450,
  },
  subscriptionCancellation: {
    Component: SubscriptionCancellationModal,
    width: 444,
  },
  selectWorkspaceToUpgrade: {
    Component: SelectWorkspaceToUpgrade,
    width: 400,
  },
  selectWorkspaceToStartTrial: {
    Component: SelectWorkspaceToStartTrial,
    width: 400,
  },
};

const Modals: FunctionComponent = () => {
  const [themeProps, setThemeProps] = useState({});
  const { pathname } = useLocation();
  const { modalClosed } = useActions();
  const {
    modals: stateModals,
    preferences: {
      settings: { customVSCodeTheme },
    },
    currentModal,
  } = useAppState();

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

  useEffect(() => {
    setThemeProps(
      pathname.includes('/s/')
        ? {
            theme: localState.theme.vscodeTheme,
          }
        : {}
    );
  }, [pathname, localState]);

  const modal = currentModal && modals[currentModal];
  return (
    <ThemeProvider {...themeProps}>
      <Modal
        isOpen={Boolean(modal)}
        width={
          modal &&
          (typeof modal.width === 'function' ? modal.width() : modal.width)
        }
        top={modal && modal.top}
        onClose={() => modalClosed()}
      >
        {modal
          ? React.createElement(modal.Component, {
              closeModal: () => modalClosed(),
            })
          : null}
      </Modal>

      {stateModals.alertModal.isCurrent && <GenericAlertModal />}
    </ThemeProvider>
  );
};

export { Modals };

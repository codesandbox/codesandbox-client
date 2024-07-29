import { ThemeProvider } from '@codesandbox/components';
import Modal from 'app/components/Modal';
import { useAppState, useActions } from 'app/overmind';
import React, { FunctionComponent, useState } from 'react';

import { ImportRepository } from 'app/components/Create/ImportRepository';
import { CreateBox } from 'app/components/Create/CreateBox';
import { GenericCreate } from 'app/components/Create/GenericCreate';
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
import { Preferences } from './PreferencesModal';
import { RecoverFilesModal } from './RecoverFilesModal';
import { SandboxPickerModal } from './SandboxPickerModal';
import { SelectSandboxModal } from './SelectSandboxModal';
import { ShareModal } from './ShareModal';
import { SignInForTemplates } from './SignInForTemplates';
import { StorageManagementModal } from './StorageManagementModal';
import { SurveyModal } from './SurveyModal';
import { TeamInviteModal } from './TeamInviteModal';
import { UploadModal } from './UploadModal';
import { MinimumPrivacyModal } from './MinimumPrivacyModal';
import { GenericAlertModal } from './GenericAlertModal';
import { AccountDeletionModal } from './AccountDeletion';
import { AccountDeletionConfirmationModal } from './AccountDeletion/DeletedConfirmation';
import { UndoAccountDeletionModal } from './UndoAccountDeletion';
import { UndoAccountDeletionConfirmationModal } from './UndoAccountDeletion/UndoDeletedConfirmation';
import { NotFoundBranchModal } from './NotFoundBranchModal';
import { GithubPagesLogs } from './GithubPagesLogs';
import { CropThumbnail } from './CropThumbnail';

const modals = {
  preferences: {
    Component: Preferences,
    width: 900,
  },
  createDevbox: {
    Component: CreateBox,
    width: 950,
    props: {
      type: 'devbox',
    },
  },
  createSandbox: {
    Component: CreateBox,
    width: 950,
    props: {
      type: 'sandbox',
    },
  },
  genericCreate: {
    Component: GenericCreate,
    width: 950,
  },
  importRepository: {
    Component: ImportRepository,
    width: 950,
  },
  share: {
    Component: ShareModal,
    width: 1200,
  },
  deployment: {
    Component: DeploymentModal,
    width: 600,
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
};

const Modals: FunctionComponent = () => {
  const [themeProps] = useState({});
  const { modalClosed } = useActions();
  const {
    modals: stateModals,
    currentModal,
    currentModalItemId,
    repoToImport,
    sandboxIdToFork,
  } = useAppState();

  const modal = currentModal && modals[currentModal];
  if (currentModal === 'createDevbox' || currentModal === 'createSandbox') {
    modal.props = {
      ...modal.props,
      ...(currentModalItemId ? { collectionId: currentModalItemId } : {}),
      ...(sandboxIdToFork ? { sandboxIdToFork } : {}),
    };
  }

  if (currentModal === 'importRepository') {
    modal.props = {
      ...modal.props,
      preSelectedRepo: repoToImport,
    };
  }

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
              ...(modal.props || {}),
              closeModal: () => modalClosed(),
              isModal: true,
            })
          : null}
      </Modal>

      {stateModals.alertModal.isCurrent && <GenericAlertModal />}
    </ThemeProvider>
  );
};

export { Modals };

export interface ModalContentProps {
  closeModal?: () => void;
  isModal: boolean;
}

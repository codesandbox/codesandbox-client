import { ThemeProvider } from '@codesandbox/components';
import Modal from 'app/components/Modal';
import { useAppState, useActions } from 'app/overmind';
import React, { FunctionComponent, useState } from 'react';

import { ImportRepository } from 'app/components/Create/ImportRepository';
import { CreateBox } from 'app/components/Create/CreateBox';
import { DeleteProfileSandboxModal } from './DeleteProfileSandboxModal';
import { EmptyTrash } from './EmptyTrash';
import { FeedbackModal } from './FeedbackModal';
import { Preferences } from './PreferencesModal';
import { SandboxPickerModal } from './SandboxPickerModal';
import { SelectSandboxModal } from './SelectSandboxModal';
import { SignInForTemplates } from './SignInForTemplates';
import { StorageManagementModal } from './StorageManagementModal';
import { SurveyModal } from './SurveyModal';
import { TeamInviteModal } from './TeamInviteModal';
import { MinimumPrivacyModal } from './MinimumPrivacyModal';
import { GenericAlertModal } from './GenericAlertModal';
import { AccountDeletionModal } from './AccountDeletion';
import { AccountDeletionConfirmationModal } from './AccountDeletion/DeletedConfirmation';
import { UndoAccountDeletionModal } from './UndoAccountDeletion';
import { UndoAccountDeletionConfirmationModal } from './UndoAccountDeletion/UndoDeletedConfirmation';

const modals = {
  preferences: {
    Component: Preferences,
    width: 900,
  },
  create: {
    Component: CreateBox,
    width: 950,
  },
  import: {
    Component: ImportRepository,
    width: 950,
  },
  teamInvite: {
    Component: TeamInviteModal,
    width: 400,
  },
  signInForTemplates: {
    Component: SignInForTemplates,
    width: 400,
  },
  deleteProfileSandbox: {
    Component: DeleteProfileSandboxModal,
    width: 400,
  },
  emptyTrash: {
    Component: EmptyTrash,
    width: 400,
  },
  selectSandbox: {
    Component: SelectSandboxModal,
    width: 600,
  },
  storageManagement: {
    Component: StorageManagementModal,
    width: 800,
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
  if (currentModal === 'create') {
    modal.props = {
      ...modal.props,
      ...(currentModalItemId ? { collectionId: currentModalItemId } : {}),
      ...(sandboxIdToFork ? { sandboxIdToFork } : {}),
    };
  }

  if (currentModal === 'import') {
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

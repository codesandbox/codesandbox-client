import getTemplateDefinition from '@codesandbox/common/lib/templates';
import codesandbox from '@codesandbox/common/lib/themes/codesandbox.json';
import Modal from 'app/components/Modal';
import getVSCodeTheme from 'app/src/app/pages/Sandbox/Editor/utils/get-vscode-theme';
import Loadable from 'app/utils/Loadable';
import { templateColor } from 'app/utils/template-color';
import React, { useReducer, useEffect, useCallback } from 'react';
import { useOvermind } from 'app/overmind';
import { ThemeProvider } from 'styled-components';

import CommitModal from './CommitModal';
import { DeleteDeploymentModal } from './DeleteDeploymentModal';
import { DeleteProfileSandboxModal } from './DeleteProfileSandboxModal';
import DeleteSandboxModal from './DeleteSandboxModal';
import DeploymentModal from './DeploymentModal';
import { EmptyTrash } from './EmptyTrash';
import ExportGitHubModal from './ExportGitHubModal';
import { FeedbackModal } from './FeedbackModal';
import { ForkServerModal } from './ForkServerModal';
import LiveSessionEnded from './LiveSessionEnded';
import LiveSessionVersionMismatch from './LiveSessionVersionMismatch';
import NetlifyLogs from './NetlifyLogs';
import NewSandbox from './NewSandbox';
import { PickSandboxModal } from './PickSandboxModal';
import PreferencesModal from './PreferencesModal';
import PrivacyServerWarning from './PrivacyServerWarning';
import PRModal from './PRModal';
import SearchDependenciesModal from './SearchDependenciesModal';
import SelectSandboxModal from './SelectSandboxModal';
import ShareModal from './ShareModal';
import SignInForTemplates from './SignInForTemplates';
import { StorageManagementModal } from './StorageManagementModal';
import { SurveyModal } from './SurveyModal';
import UploadModal from './UploadModal';

const MoveSandboxFolderModal = Loadable(() =>
  import('./MoveSandboxFolderModal')
);

const modals = {
  preferences: {
    Component: PreferencesModal,
    width: 900,
  },
  newSandbox: {
    Component: NewSandbox,
    width: 925,
  },
  share: {
    Component: ShareModal,
    width: 1200,
  },
  deployment: {
    Component: DeploymentModal,
    width: 750,
  },
  exportGithub: {
    Component: ExportGitHubModal,
    width: 400,
  },
  commit: {
    Component: CommitModal,
    width: 400,
  },
  signInForTemplates: {
    Component: SignInForTemplates,
    width: 400,
  },
  pr: {
    Component: PRModal,
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
    width: 600,
  },
  liveSessionEnded: {
    Component: LiveSessionEnded,
    width: 600,
  },
  liveVersionMismatch: {
    Component: LiveSessionVersionMismatch,
    width: 600,
  },
  uploading: {
    Component: UploadModal,
    width: 600,
  },
  storageManagement: {
    Component: StorageManagementModal,
    width: 800,
  },
  forkServerModal: {
    Component: ForkServerModal,
    width: 500,
  },
  privacyServerWarning: {
    Component: PrivacyServerWarning,
    width: 400,
  },
  moveSandbox: {
    Component: MoveSandboxFolderModal,
    width: 350,
  },
  feedback: {
    Component: FeedbackModal,
    width: 450,
  },
  userSurvey: {
    Component: SurveyModal,
    width: 850,
  },
};

const Modals = () => {
  const {
    actions: { modalClosed },
    state: {
      editor: { currentSandbox },
      preferences: {
        settings: { customVSCodeTheme },
      },
      currentModal,
    },
  } = useOvermind();

  const [state, setState] = useReducer((s, a) => ({ ...s, ...a }), {
    theme: {
      colors: {},
      vscodeTheme: codesandbox,
    },
    customVSCodeTheme,
  });

  const loadTheme = useCallback(async () => {
    try {
      const theme = await getVSCodeTheme('', customVSCodeTheme);
      setState({ theme, customVSCodeTheme });
    } catch (e) {
      console.error(e);
    }
  }, [customVSCodeTheme]);

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  useEffect(() => {
    if (customVSCodeTheme !== state.customVSCodeTheme) {
      loadTheme();
    }
  });

  const sandbox = currentSandbox;
  const templateDef = sandbox && getTemplateDefinition(sandbox.template);

  const modal = currentModal && modals[currentModal];

  return (
    <ThemeProvider
      theme={{
        templateColor: templateColor(sandbox, templateDef),
        templateBackgroundColor: templateDef && templateDef.backgroundColor,
        ...state.theme,
      }}
    >
      <Modal
        isOpen={Boolean(modal)}
        width={modal && modal.width}
        onClose={isKeyDown => modalClosed({ isKeyDown })}
      >
        {modal
          ? React.createElement(modal.Component, {
              closeModal: () => modalClosed({ isKeyDown: false }),
            })
          : null}
      </Modal>
    </ThemeProvider>
  );
};
export default Modals;
// export default inject('store', 'signals')(observer(Modals));

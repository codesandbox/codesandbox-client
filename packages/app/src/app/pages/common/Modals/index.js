import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Modal from 'app/components/Modal';
import Loadable from 'app/utils/Loadable';
import { ThemeProvider } from 'styled-components';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import codesandbox from '@codesandbox/common/lib/themes/codesandbox.json';
import getVSCodeTheme from 'app/src/app/pages/Sandbox/Editor/utils/get-vscode-theme';

import NewSandbox from './NewSandbox';
import PreferencesModal from './PreferencesModal';
import DeleteSandboxModal from './DeleteSandboxModal';
import DeleteDeploymentModal from './DeleteDeploymentModal/';
import ShareModal from './ShareModal';
import DeploymentModal from './DeploymentModal';
import ExportGitHubModal from './ExportGitHubModal';
import CommitModal from './CommitModal';
import PRModal from './PRModal';
import SelectSandboxModal from './SelectSandboxModal';
import SearchDependenciesModal from './SearchDependenciesModal';
import DeleteProfileSandboxModal from './DeleteProfileSandboxModal';
import EmptyTrash from './EmptyTrash';
import LiveSessionEnded from './LiveSessionEnded';
import LiveSessionVersionMismatch from './LiveSessionVersionMismatch';
import UploadModal from './UploadModal';
import StorageManagementModal from './StorageManagementModal';
import ForkServerModal from './ForkServerModal';
import PrivacyServerWarning from './PrivacyServerWarning';
import PickSandboxModal from './PickSandboxModal';
import FeedbackModal from './FeedbackModal';
import StarterModal from './StarterModal';
import NetlifyLogs from './NetlifyLogs';

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
  starter: {
    Component: StarterModal,
    width: 450,
  },
};

class Modals extends Component {
  state = {
    theme: {
      colors: {},
      vscodeTheme: codesandbox,
    },
    customVSCodeTheme: this.props.store.preferences.settings.customVSCodeTheme,
  };

  componentDidMount() {
    this.loadTheme();
  }

  componentDidUpdate() {
    if (
      this.props.store.preferences.settings.customVSCodeTheme !==
      this.state.customVSCodeTheme
    ) {
      this.loadTheme();
    }
  }

  loadTheme = async () => {
    const customVSCodeTheme = this.props.store.preferences.settings
      .customVSCodeTheme;

    try {
      const theme = await getVSCodeTheme('', customVSCodeTheme);
      this.setState({ theme, customVSCodeTheme });
    } catch (e) {
      console.error(e);
    }
  };
  render() {
    const { signals, store } = this.props;
    const sandbox = store.editor.currentSandbox;
    const templateDef = sandbox && getTemplateDefinition(sandbox.template);
    const modal = store.currentModal && modals[store.currentModal];

    return (
      <ThemeProvider
        theme={{
          templateColor: templateDef && templateDef.color,
          templateBackgroundColor: templateDef && templateDef.backgroundColor,
          ...this.state.theme,
        }}
      >
        <Modal
          isOpen={Boolean(modal)}
          width={modal && modal.width}
          onClose={(isKeyDown: boolean) => signals.modalClosed({ isKeyDown })}
        >
          {modal
            ? React.createElement(modal.Component, {
                closeModal: () => signals.modalClosed({ isKeyDown: false }),
              })
            : null}
        </Modal>
      </ThemeProvider>
    );
  }
}

export default inject('store', 'signals')(observer(Modals));

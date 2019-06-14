import Loadable from 'app/utils/Loadable';

export const modals = {
  preferences: {
    Component: Loadable(() => import('./PreferencesModal')),
    width: 900,
  },
  newSandbox: {
    Component: Loadable(() => import('./NewSandbox')),
    width: 925,
  },
  share: {
    Component: Loadable(() => import('./ShareModal')),
    width: 1200,
  },
  deployment: {
    Component: Loadable(() => import('./DeploymentModal')),
    width: 750,
  },
  exportGithub: {
    Component: Loadable(() => import('./ExportGitHubModal')),
    width: 400,
  },
  commit: {
    Component: Loadable(() => import('./CommitModal')),
    width: 400,
  },
  pr: {
    Component: Loadable(() => import('./PRModal')),
    width: 400,
  },
  netlifyLogs: {
    Component: Loadable(() => import('./NetlifyLogs')),
    width: 750,
  },
  deleteDeployment: {
    Component: Loadable(() => import('./DeleteDeploymentModal')),
    width: 400,
  },
  deleteSandbox: {
    Component: Loadable(() => import('./DeleteSandboxModal')),
    width: 400,
  },
  pickSandbox: {
    Component: Loadable(() => import('./PickSandboxModal')),
    width: 600,
  },
  deleteProfileSandbox: {
    Component: Loadable(() => import('./DeleteProfileSandboxModal')),
    width: 400,
  },
  emptyTrash: {
    Component: Loadable(() => import('./EmptyTrash')),
    width: 400,
  },
  selectSandbox: {
    Component: Loadable(() => import('./SelectSandboxModal')),
    width: 600,
  },
  searchDependencies: {
    Component: Loadable(() => import('./SearchDependenciesModal')),
    width: 800,
    top: 5,
  },
  liveSessionEnded: {
    Component: Loadable(() => import('./LiveSessionEnded')),
    width: 600,
  },
  liveVersionMismatch: {
    Component: Loadable(() => import('./LiveSessionVersionMismatch')),
    width: 600,
  },
  uploading: {
    Component: Loadable(() => import('./UploadModal')),
    width: 600,
  },
  storageManagement: {
    Component: Loadable(() => import('./StorageManagementModal')),
    width: 800,
  },
  forkServerModal: {
    Component: Loadable(() => import('./ForkServerModal')),
    width: 500,
  },
  privacyServerWarning: {
    Component: Loadable(() => import('./PrivacyServerWarning')),
    width: 400,
  },
  moveSandbox: {
    Component: Loadable(() => import('./MoveSandboxFolderModal')),
    width: 350,
  },
  feedback: {
    Component: Loadable(() => import('./FeedbackModal')),
    width: 450,
  },
};

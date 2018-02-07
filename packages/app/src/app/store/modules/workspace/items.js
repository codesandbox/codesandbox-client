export default [
  {
    id: 'project',
    name: 'Project Info',
  },
  {
    id: 'files',
    name: 'File Editor',
  },
  {
    id: 'github',
    name: 'GitHub',
    show: store =>
      store.isLoggedIn &&
      store.editor.currentSandbox &&
      !store.editor.currentSandbox.git,
  },
  {
    id: 'deploy',
    name: 'Deployment',
    show: store => store.isLoggedIn,
  },
  {
    id: 'config',
    name: 'Configuration Files',
  },
];

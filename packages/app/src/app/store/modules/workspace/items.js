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
      console.log(
        store.isLoggedIn,
        store.editor.currentSandbox,
        store.editor.currentSandbox && store.editor.currentSandbox.git
      ) ||
      (store.isLoggedIn &&
        store.editor.currentSandbox &&
        !store.editor.currentSandbox.git),
  },
  {
    id: 'deploy',
    name: 'Deployment',
  },
  {
    id: 'config',
    name: 'Configurations',
  },
];

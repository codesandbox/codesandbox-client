import { Sandbox } from '@codesandbox/common/lib/types';

export default {
  export(sandbox: Sandbox) {
    return import(
      /* webpackChunkName: 'export-to-github' */ './export-to-github'
    ).then(exportToGithub => exportToGithub.default(sandbox));
  },
};

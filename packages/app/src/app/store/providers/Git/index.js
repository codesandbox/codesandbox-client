import { Provider } from '@cerebral/fluent';

export default Provider({
  export(sandbox) {
    return import(/* webpackChunkName: 'export-to-github' */ './export-to-github').then(
      exportToGithub => exportToGithub.default(sandbox)
    );
  },
});

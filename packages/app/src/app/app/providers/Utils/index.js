import { Provider } from 'cerebral';
import resolveMainModule from 'common/sandbox/resolve-module';
import prettify from './prettify';

export default Provider({
  prettify(fileName, code) {
    return prettify(
      fileName,
      code,
      this.context.state.get('editor.preferences.settings.prettierConfig')
    );
  },
  resolveMainModule,
  zipSandbox(sandbox) {
    return import(/* webpackChunkName: 'create-zip' */ './create-zip').then(
      module => {
        module.default(sandbox, sandbox.modules, sandbox.directories);
      }
    );
  },
});

import { Provider } from 'cerebral';
import resolveModule from 'common/sandbox/resolve-module';
import { isEqual } from 'lodash';
import * as prettify from 'app/utils/prettify';

export default Provider({
  prettify(fileName, code) {
    return prettify(
      fileName,
      code,
      this.context.state.get('editor.preferences.settings.prettierConfig')
    );
  },
  resolveModule,
  isEqual,
  getZip(sandbox) {
    return import(/* webpackChunkName: 'create-zip' */ './create-zip').then(
      module =>
        module
          .getZip(sandbox, sandbox.modules, sandbox.directories)
          .then(result => ({ file: result.file }))
    );
  },
  zipSandbox(sandbox) {
    return import(/* webpackChunkName: 'create-zip' */ './create-zip').then(
      module =>
        module
          .default(sandbox, sandbox.modules, sandbox.directories)
          .then(file => ({ file }))
    );
  },
});

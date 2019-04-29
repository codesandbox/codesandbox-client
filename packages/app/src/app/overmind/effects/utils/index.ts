import { resolveModule } from '@codesandbox/common/lib/sandbox/modules';
import { isEqual } from 'lodash-es';
import prettify from 'app/utils/prettify';
import { Sandbox, PrettierConfig } from 'types';

let nextOptimisticId = 0;

export default {
  createOptimisticId() {
    return 'OPTIMISTIC_' + nextOptimisticId++;
  },
  prettify(
    fileName: string,
    code: string,
    config: PrettierConfig,
    isCurrentModule: () => boolean
  ) {
    return prettify(fileName, code, config, isCurrentModule);
  },
  resolveModule,
  isEqual,
  getZip(sandbox: Sandbox) {
    return import(/* webpackChunkName: 'create-zip' */ './create-zip').then(
      module =>
        module
          .getZip(sandbox, sandbox.modules, sandbox.directories)
          .then(result => ({ file: result.file }))
    );
  },
  zipSandbox(sandbox: Sandbox) {
    return import(/* webpackChunkName: 'create-zip' */ './create-zip').then(
      module =>
        module
          .default(sandbox, sandbox.modules, sandbox.directories)
          .then(file => ({ file }))
    );
  },
};

import { Sandbox } from '@codesandbox/common/lib/types';

export default {
  create(sandbox: Sandbox) {
    return import(
      /* webpackChunkName: 'create-zip' */ './create-zip'
    ).then(module =>
      module
        .getZip(sandbox, sandbox.modules, sandbox.directories)
        .then(result => ({ file: result.file }))
    );
  },
  download(sandbox: Sandbox) {
    return import(
      /* webpackChunkName: 'create-zip' */ './create-zip'
    ).then(module =>
      module
        .default(sandbox, sandbox.modules, sandbox.directories)
        .then(file => ({ file }))
    );
  },
};

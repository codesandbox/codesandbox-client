import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { getSandboxOptions } from '@codesandbox/common/lib/url';
import history from '../../utils/history';
import {
  Sandbox,
  SandboxUrlSourceData,
  GitInfo,
} from '@codesandbox/common/lib/types';

export default {
  updateSandboxUrlById(sandboxId: string) {
    history.push(
      sandboxUrl({
        id: sandboxId,
      })
    );
  },
  updateSandboxUrlByAlias(alias: string) {
    history.push(
      sandboxUrl({
        alias,
      })
    );
  },
  updateSandboxUrlByGit(git: GitInfo) {
    history.push(
      sandboxUrl({
        git,
      })
    );
  },
  redirectToNewSandbox() {
    history.push('/s/new');
  },
  redirectToSandboxWizard() {
    history.replace('/s/');
  },
  getSandboxOptions() {
    return getSandboxOptions(decodeURIComponent(document.location.href));
  },
};

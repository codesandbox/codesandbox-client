import { GitInfo } from '@codesandbox/common/lib/types';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { getSandboxOptions } from '@codesandbox/common/lib/url';
import history from '../../utils/history';

export default {
  replaceSandboxUrl({
    id,
    alias,
    git,
  }: {
    id?: string;
    alias?: string;
    git?: GitInfo;
  }) {
    window.history.replaceState({}, null, sandboxUrl({ id, alias, git }));
  },
  updateSandboxUrl({
    id,
    alias,
    git,
  }: {
    id?: string;
    alias?: string;
    git?: GitInfo;
  }) {
    history.push(
      sandboxUrl({
        id,
        alias,
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

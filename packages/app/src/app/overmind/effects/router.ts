import { GitInfo } from '@codesandbox/common/lib/types';
import { getSandboxOptions } from '@codesandbox/common/lib/url';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';

import history from '../../utils/history';

export default {
  replaceSandboxUrl({
    id,
    alias,
    git,
  }: {
    id?: string | null;
    alias?: string | null;
    git?: GitInfo | null;
  }) {
    window.history.replaceState({}, '', sandboxUrl({ id, alias, git }));
  },
  updateSandboxUrl(
    {
      id,
      alias,
      git,
    }: {
      id?: string | null;
      alias?: string | null;
      git?: GitInfo | null;
    },
    { openInNewWindow = false }: { openInNewWindow?: boolean } = {}
  ) {
    const url = sandboxUrl({
      id,
      alias,
      git,
    });

    if (openInNewWindow) {
      window.open(url, '_blank');
    } else {
      history.push(url);
    }
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

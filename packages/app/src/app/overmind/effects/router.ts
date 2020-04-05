import { GitInfo } from '@codesandbox/common/lib/types';
import { getSandboxOptions } from '@codesandbox/common/lib/url';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import history from '../../utils/history';

export default new (class RouterEffect {
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
  }

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
  }

  redirectToNewSandbox() {
    history.push('/s/new');
  }

  redirectToSandboxWizard() {
    history.replace('/s/');
  }

  getSandboxOptions() {
    return getSandboxOptions(decodeURIComponent(document.location.href));
  }

  getCommentId() {
    return this.getParameter('comment');
  }

  createCommentUrl(id: string) {
    return `${window.location.origin}${window.location.pathname}?comment=${id}`;
  }

  setParameter(key: string, value: string | null) {
    const currentUrl = new URL(location.href);
    if (value === null) {
      currentUrl.searchParams.delete(key);
    } else {
      currentUrl.searchParams.set(key, value);
    }

    history.replace(currentUrl.toString().replace(currentUrl.origin, ''));
  }

  getParameter(key: string): string | null {
    const currentUrl = new URL(location.href);
    return currentUrl.searchParams.get(key);
  }
})();

import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { getSandboxOptions } from '@codesandbox/common/lib/url';
import history from '../../utils/history';

export default {
  updateSandboxUrl(sandbox) {
    history.push(sandboxUrl(sandbox));
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

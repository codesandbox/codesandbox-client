import { Provider } from 'cerebral';
import { sandboxUrl } from 'common/lib/utils/url-generator';
import { getSandboxOptions } from 'common/lib/url';
import history from '../../utils/history';

export default Provider({
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
});

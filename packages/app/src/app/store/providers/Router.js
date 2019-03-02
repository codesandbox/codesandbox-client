import { Provider } from 'cerebral';
import { sandboxUrl } from 'common/libutils/url-generator';
import { getSandboxOptions } from 'common/liburl';
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

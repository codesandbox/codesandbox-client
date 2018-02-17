import { Provider } from '@cerebral/fluent';
import { sandboxUrl } from 'common/utils/url-generator';
import { getSandboxOptions } from 'common/url';
import history from '../../utils/history';

export default Provider({
  updateSandboxUrl(sandbox) {
    history.push(sandboxUrl(sandbox));
  },
  redirectToNewSandbox() {
    history.push('/s/new');
  },
  getSandboxOptions() {
    return getSandboxOptions(decodeURIComponent(document.location.href));
  },
});

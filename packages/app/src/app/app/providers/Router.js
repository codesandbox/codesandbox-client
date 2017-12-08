import { Provider } from 'cerebral';
import { sandboxUrl } from 'common/utils/url-generator';
import history from '../../utils/history';

export default Provider({
  updateSandboxUrl(sandbox) {
    history.push(sandboxUrl(sandbox));
  },
});

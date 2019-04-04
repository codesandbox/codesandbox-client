import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';

const openSandbox = id => {
  const url = sandboxUrl({ id });
  window.open(url, '_blank');
};

export default openSandbox;

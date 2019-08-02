import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { getSandboxOptions } from '@codesandbox/common/lib/url';
import history from '../../utils/history';
import {
  Sandbox,
  SandboxUrlSourceData,
  GitInfo,
} from '@codesandbox/common/lib/types';

export default {
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

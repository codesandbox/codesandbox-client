import { SandboxFragmentDashboardFragment as Sandbox } from 'app/graphql/types';
import {
  sandboxUrl,
  vsCodeUrl,
  vsCodeLauncherUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { useGlobalPersistedState } from './usePersistedState';
import { useBetaSandboxEditor } from './useBetaSandboxEditor';

export type UseBoxUrlReturnType = {
  boxUrl: string;
  requiresNewTab?: boolean;
};

export const useBoxUrl = (sandbox: Sandbox): UseBoxUrlReturnType => {
  const [autoLaunchVSCode] = useGlobalPersistedState(
    'AUTO_LAUNCH_VSCODE',
    false
  );
  const [hasBetaEditorExperiment] = useBetaSandboxEditor();
  const [editor] = useGlobalPersistedState<'csb' | 'vscode'>(
    'DEFAULT_EDITOR',
    'csb'
  );

  if (!sandbox.isV2) {
    return {
      boxUrl: sandboxUrl(sandbox, hasBetaEditorExperiment),
    };
  }

  if (editor === 'csb') {
    return {
      boxUrl: sandboxUrl(sandbox, hasBetaEditorExperiment),
    };
  }

  if (autoLaunchVSCode) {
    return {
      boxUrl: vsCodeUrl(sandbox.id),
      requiresNewTab: true,
    };
  }

  return {
    boxUrl: vsCodeLauncherUrl(sandbox.id),
    requiresNewTab: true,
  };
};

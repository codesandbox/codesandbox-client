import { BranchFragment } from 'app/graphql/types';
import {
  vsCodeBranchLauncherUrl,
  vsCodeBranchUrl,
  v2BranchUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { useGlobalPersistedState } from './usePersistedState';

export type UseBranchUrlReturnType = {
  branchUrl: string;
  requiresNewTab?: boolean;
};

export const useBranchUrl = (
  branch: BranchFragment
): UseBranchUrlReturnType => {
  const [autoLaunchVSCode] = useGlobalPersistedState(
    'AUTO_LAUNCH_VSCODE',
    false
  );
  const [editor] = useGlobalPersistedState<'csb' | 'vscode'>(
    'DEFAULT_EDITOR',
    'csb'
  );

  const { name, project } = branch;

  if (editor === 'csb') {
    return {
      branchUrl: v2BranchUrl({
        owner: project.repository.owner,
        repoName: project.repository.name,
        branchName: name,
        workspaceId: project.team?.id || null,
      }),
    };
  }

  if (autoLaunchVSCode) {
    return {
      branchUrl: vsCodeBranchUrl(branch.id),
      requiresNewTab: true,
    };
  }

  return {
    branchUrl: vsCodeBranchLauncherUrl(branch.id),
    requiresNewTab: true,
  };
};

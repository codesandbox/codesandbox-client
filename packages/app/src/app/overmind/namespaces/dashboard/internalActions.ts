import { Context } from 'app/overmind';
import { SandboxFragmentDashboardFragment } from 'app/graphql/types';

/**
 * Change sandbox frozen in state and returns the sandboxes that have changed in their old state
 */
export const changeSandboxesInState = (
  { state: { dashboard } }: Context,
  {
    sandboxIds,
    sandboxMutation,
  }: {
    sandboxIds: string[];
    /**
     * The mutation that happens on the sandbox, make sure to return a *new* sandbox here, to make sure
     * that we can still rollback easily in the future.
     */
    sandboxMutation: <T extends SandboxFragmentDashboardFragment>(
      sandbox: T
    ) => T;
  }
) => {
  const changedSandboxes: Set<ReturnType<typeof sandboxMutation>> = new Set();

  const doMutateSandbox = <T extends SandboxFragmentDashboardFragment>(
    sandbox: T
  ): T => {
    changedSandboxes.add(sandbox);
    return sandboxMutation(sandbox);
  };

  type SandboxTypes = keyof typeof dashboard.sandboxes;
  Object.keys(dashboard.sandboxes)
    .filter(t => dashboard.sandboxes[t])
    .forEach((type: SandboxTypes) => {
      // For typescript, we've filtered out all pages that have `null` as value, but we need to let TS
      // know that's the case here
      const sandboxStructure = dashboard.sandboxes as {
        [key in SandboxTypes]: NonNullable<typeof dashboard.sandboxes[key]>;
      };

      if (type === 'RECENT_BRANCHES') {
        return;
      }

      if (type === 'REPOS') {
        Object.keys(sandboxStructure.REPOS).forEach(repoName => {
          const repoSandboxes = sandboxStructure.REPOS[repoName];
          if (!repoSandboxes.sandboxes) {
            return;
          }

          repoSandboxes.sandboxes = repoSandboxes.sandboxes.map(sandbox => {
            if (sandboxIds.includes(sandbox.id)) {
              return doMutateSandbox(sandbox);
            }

            return sandbox;
          });
        });
      } else if (type === 'TEMPLATES' || type === 'TEMPLATE_HOME') {
        dashboard.sandboxes[type] = sandboxStructure[type].map(template => {
          if (template.sandbox && sandboxIds.includes(template.sandbox.id)) {
            return {
              ...template,
              sandbox: doMutateSandbox(template.sandbox),
            };
          }

          return template;
        });
      } else if (type === 'ALL') {
        // These are all folders
        const folders = sandboxStructure.ALL;
        const folderNames = Object.keys(folders);

        folderNames.forEach(folderName => {
          folders[folderName] = folders[folderName].map(sandbox => {
            if (sandboxIds.includes(sandbox.id)) {
              return doMutateSandbox(sandbox);
            }

            return sandbox;
          });
        });
      } else {
        // If it's not a folder
        dashboard.sandboxes[type] = sandboxStructure[type].map(sandbox => {
          if (sandboxIds.includes(sandbox.id)) {
            return doMutateSandbox(sandbox);
          }

          return sandbox;
        });
      }
    });

  return { changedSandboxes };
};

export const deleteSandboxesFromState = (
  { state: { dashboard } }: Context,
  {
    ids,
  }: {
    ids: string[];
  }
) => {
  const sandboxFilter = <T extends SandboxFragmentDashboardFragment>(
    sandbox: T
  ): boolean => !ids.includes(sandbox.id);

  type SandboxTypes = keyof typeof dashboard.sandboxes;
  Object.keys(dashboard.sandboxes)
    .filter(t => dashboard.sandboxes[t])
    .forEach((type: SandboxTypes) => {
      // For typescript, we've filtered out all pages that have `null` as value, but we need to let TS
      // know that's the case here
      const sandboxStructure = dashboard.sandboxes as {
        [key in SandboxTypes]: NonNullable<typeof dashboard.sandboxes[key]>;
      };

      if (type === 'ALL') {
        const folderNames = Object.keys(sandboxStructure[type]);
        folderNames.forEach(folderName => {
          if (!sandboxStructure.ALL[folderName]) {
            return;
          }

          const newSandboxes = sandboxStructure.ALL[folderName].filter(
            sandboxFilter
          );
          if (newSandboxes.length !== sandboxStructure.ALL[folderName].length) {
            sandboxStructure.ALL[folderName] = newSandboxes;
          }
        });
      } else if (type === 'TEMPLATES' || type === 'TEMPLATE_HOME') {
        const newTemplates = sandboxStructure[type].filter(
          t => t.sandbox && !ids.includes(t.sandbox.id)
        );

        if (newTemplates.length !== sandboxStructure[type].length) {
          dashboard.sandboxes[type] = newTemplates;
        }
      } else if (type === 'REPOS') {
        const repos = Object.keys(sandboxStructure.REPOS);
        repos.forEach(repo => {
          const repoSandbox = sandboxStructure.REPOS[repo];
          const newSandboxes = repoSandbox.sandboxes.filter(sandboxFilter);
          if (newSandboxes.length !== repoSandbox.sandboxes.length) {
            repoSandbox.sandboxes = newSandboxes;
          }
        });
      } else if (type !== 'RECENT_BRANCHES') {
        const newSandboxes = sandboxStructure[type].filter(sandboxFilter);
        if (newSandboxes.length !== sandboxStructure[type].length) {
          dashboard.sandboxes[type] = newSandboxes;
        }
      }
    });
};

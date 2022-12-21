import { compareDesc, parseISO } from 'date-fns';
import { json } from 'overmind';
import { Context } from 'app/overmind';
import { withLoadApp } from 'app/overmind/factories';
import downloadZip from 'app/overmind/effects/zip/create-zip';
import { uniq } from 'lodash-es';
import {
  TemplateFragmentDashboardFragment,
  SandboxFragmentDashboardFragment,
  RepoFragmentDashboardFragment,
  TeamMemberAuthorization,
  CreateOrUpdateNpmRegistryMutationVariables,
  DeleteNpmRegistryMutationVariables,
} from 'app/graphql/types';
import { v2DraftBranchUrl } from '@codesandbox/common/lib/utils/url-generator';
import { notificationState } from '@codesandbox/common/lib/utils/notifications';
import { NotificationStatus } from '@codesandbox/notifications';
import {
  getDecoratedCollection,
  sortByNameAscending,
  getProjectUniqueKey,
} from './utils';

import { OrderBy, PageTypes, sandboxesTypes } from './types';
import * as internalActions from './internalActions';

export const internal = internalActions;

export const dashboardMounted = withLoadApp();

export const sandboxesSelected = (
  { state }: Context,
  {
    sandboxIds,
  }: {
    sandboxIds: string[];
  }
) => {
  state.dashboard.selectedSandboxes = sandboxIds;
};

export const setTrashSandboxes = (
  { state }: Context,
  {
    sandboxIds,
  }: {
    sandboxIds: string[];
  }
) => {
  state.dashboard.trashSandboxIds = sandboxIds;
};

export const dragChanged = (
  { state }: Context,
  { isDragging }: { isDragging: boolean }
) => {
  state.dashboard.isDragging = isDragging;
};

export const orderByReset = ({ state }: Context) => {
  if (
    state.dashboard.orderBy.field !== 'updatedAt' ||
    state.dashboard.orderBy.order !== 'desc'
  ) {
    state.dashboard.orderBy = {
      order: 'desc',
      field: 'updatedAt',
    };
  }
};

export const orderByChanged = ({ state }: Context, orderBy: OrderBy) => {
  state.dashboard.orderBy = orderBy;
};

export const blacklistedTemplateAdded = (
  { state }: Context,
  template: string
) => {
  state.dashboard.filters.blacklistedTemplates = state.dashboard.filters.blacklistedTemplates.concat(
    template
  );
};

export const blacklistedTemplateRemoved = (
  { state }: Context,
  template: string
) => {
  state.dashboard.filters.blacklistedTemplates = state.dashboard.filters.blacklistedTemplates.filter(
    currentTemplate => currentTemplate !== template
  );
};

export const blacklistedTemplatesCleared = ({ state }: Context) => {
  if (state.dashboard.filters.blacklistedTemplates.length) {
    state.dashboard.filters.blacklistedTemplates = [];
  }
};

export const blacklistedTemplatesChanged = (
  { state }: Context,
  templates: string[]
) => {
  state.dashboard.filters.blacklistedTemplates = templates;
};

export const searchChanged = (
  { state }: Context,
  { search }: { search: string }
) => {
  state.dashboard.filters.search = search;
};

export const viewModeChanged = (
  { state, effects }: Context,
  { mode }: { mode: 'grid' | 'list' }
) => {
  effects.analytics.track('Dashboard - Change View Mode', { mode });
  state.dashboard.viewMode = mode;
  effects.browser.storage.set('VIEW_MODE_DASHBOARD', mode);
};

export const createSandboxClicked = (
  { actions }: Context,
  {
    body,
    sandboxId,
  }: {
    body: { collectionId: string };
    sandboxId: string;
  }
) => actions.editor.forkExternalSandbox({ body, sandboxId });

export const deleteTemplate = async (
  { actions, effects, state }: Context,
  {
    sandboxId,
    templateId,
  }: {
    sandboxId: string;
    templateId: string;
  }
) => {
  const oldTemplates = {
    TEMPLATE_HOME: state.dashboard.sandboxes.TEMPLATE_HOME,
    TEMPLATES: state.dashboard.sandboxes.TEMPLATES,
  };
  actions.dashboard.deleteTemplateFromState([sandboxId]);

  try {
    effects.analytics.track('Template - Removed', { source: 'Context Menu' });
    await effects.api.deleteTemplate(sandboxId, templateId);
    actions.modalClosed();
    effects.notificationToast.success('Template Deleted');
  } catch (error) {
    state.dashboard.sandboxes.TEMPLATES = oldTemplates.TEMPLATES
      ? [...oldTemplates.TEMPLATES]
      : null;
    state.dashboard.sandboxes.TEMPLATE_HOME = oldTemplates.TEMPLATE_HOME
      ? [...oldTemplates.TEMPLATE_HOME]
      : null;
    effects.notificationToast.error('Could not delete custom template');
  }
};

export const getTeams = async ({ state, effects }: Context) => {
  if (!state.user) return;
  const teams = await effects.gql.queries.getTeams({});

  if (!teams || !teams.me) {
    return;
  }

  state.dashboard.teams = teams.me.workspaces;
  state.personalWorkspaceId = teams.me.personalWorkspaceId;
};

export const removeFromTeam = async (
  { state, actions, effects }: Context,
  id: string
) => {
  if (!state.activeTeam || !state.activeTeamInfo) return;
  try {
    effects.analytics.track('Dashboard - Remove Team Member');
    await effects.gql.mutations.removeFromTeam({
      teamId: state.activeTeam,
      userId: id,
    });

    state.activeTeamInfo = {
      ...state.activeTeamInfo,
      users: (state.activeTeamInfo.users || []).filter(user => user.id !== id),
    };
    // update all other fields related to team
    actions.getActiveTeamInfo();
  } catch {
    effects.notificationToast.error(
      'There has been a problem removing them from your workspace'
    );
  }
};

export const leaveTeam = async ({ state, effects, actions }: Context) => {
  if (!state.activeTeam || !state.activeTeamInfo) return;
  try {
    effects.analytics.track('Team - Leave Team', {
      dashboardVersion: 2,
    });
    await effects.gql.mutations.leaveTeam({
      teamId: state.activeTeam,
    });

    actions.setActiveTeam({ id: state.personalWorkspaceId! });
    actions.dashboard.getTeams();

    effects.notificationToast.success(
      `You successfully left the ${state.activeTeamInfo.name} workspace`
    );
  } catch (e) {
    effects.notificationToast.error(
      'There has been a problem removing your from the workspace'
    );
  }
};

export const inviteToTeam = async (
  { state, actions, effects }: Context,
  {
    value,
    authorization = null,
    confirm = false,
    triggerPlace,
    inviteLink,
  }: {
    value: string;
    authorization?: TeamMemberAuthorization | null;
    confirm?: boolean;
    triggerPlace: 'settings' | 'invite-modal';
    inviteLink: string;
  }
) => {
  if (!state.activeTeam) return;
  const isEmail = value.includes('@');

  if (confirm) {
    const confirmed = await actions.modals.alertModal.open({
      title: 'Add New Member',
      customComponent: 'MemberPaymentConfirmation',
    });

    // if the user cancels the function, bail
    if (!confirmed) {
      effects.analytics.track('Team - Cancel Add Member', {
        dashboardVersion: 2,
        isEmail,
      });
      return;
    }
  }

  try {
    effects.analytics.track('Team - Add Member', {
      place: triggerPlace,
      inviteLink,
      dashboardVersion: 2,
      isEmail,
    });
    let data: any | null = null;
    if (isEmail) {
      const emailInvited = await effects.gql.mutations.inviteToTeamViaEmail({
        teamId: state.activeTeam,
        email: value,
        authorization,
      });

      data = emailInvited.inviteToTeamViaEmail;
    } else {
      const result = await effects.gql.mutations.inviteToTeam({
        teamId: state.activeTeam,
        username: value,
        authorization,
      });

      state.activeTeamInfo = result.inviteToTeam;
      data = result.inviteToTeam;
    }

    if (!data) {
      return;
    }

    effects.notificationToast.success(
      `Successfully invited ${value} to your workspace`
    );
  } catch (e) {
    const errorMessageExists =
      e.response && e.response.errors && e.response.errors.length;
    effects.notificationToast.error(
      errorMessageExists
        ? e.response.errors[0].message
        : `There was a problem inviting ${value} to your workspace`
    );
  }
};

export const getAllFolders = async ({ state, effects }: Context) => {
  try {
    const data = await effects.gql.queries.getCollections({
      teamId: state.activeTeam,
    });
    if (!data || !data.me || !data.me.collections) {
      return;
    }

    // this is here because it will be done in the backend in the *FUTURE*
    const collectionsByLevel = data.me.collections.map(collection =>
      getDecoratedCollection(collection)
    );

    state.dashboard.allCollections = collectionsByLevel.filter(c => c.id);
  } catch {
    effects.notificationToast.error(
      'There was a problem getting your sandboxes'
    );
  }
};

export const createFolder = async (
  { effects, state }: Context,
  path: string
) => {
  if (!state.dashboard.allCollections) return;
  const oldFolders = state.dashboard.allCollections;
  state.dashboard.allCollections = [
    getDecoratedCollection({ id: 'FAKE_ID', path, sandboxCount: 0 }),
    ...state.dashboard.allCollections,
  ];
  try {
    const { createCollection } = await effects.gql.mutations.createFolder({
      // only way to pass, null is a value in the BE
      // @ts-ignore
      teamId: state.activeTeam || undefined,
      path,
    });

    state.dashboard.allCollections = state.dashboard.allCollections.map(
      folder => {
        if (folder.id === 'FAKE_ID') {
          return {
            ...folder,
            id: createCollection.id,
            path: createCollection.path,
          };
        }

        return folder;
      }
    );
  } catch {
    state.dashboard.allCollections = [...oldFolders];
    effects.notificationToast.error('There was a problem creating your folder');
  }
};

export const getDrafts = async ({ state, effects }: Context) => {
  const { dashboard } = state;
  try {
    let sandboxes: SandboxFragmentDashboardFragment[];

    if (state.activeTeam) {
      const data = await effects.gql.queries.getTeamDrafts({
        teamId: state.activeTeam,
        authorId: null,
      });
      if (typeof data?.me?.team?.drafts === 'undefined') {
        return;
      }
      sandboxes = data.me.team.drafts;
    } else {
      const data = await effects.gql.queries.sandboxesByPath({
        path: '/',
        teamId: state.activeTeam,
      });
      if (typeof data?.me?.collection?.sandboxes === 'undefined') {
        return;
      }
      sandboxes = data.me.collection.sandboxes;
    }

    dashboard.sandboxes[sandboxesTypes.DRAFTS] = sandboxes.filter(
      s => !s.customTemplate
    );
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting your sandboxes'
    );
  }
};

export const getSandboxesByPath = async (
  { state, effects }: Context,
  path: string
) => {
  const { dashboard } = state;

  if (!state.activeTeam && (!path || path === '/')) {
    // For personal users we actually see the sandboxes in / as drafts. So we shouldn't
    // also show these sandboxes here.
    if (!dashboard.sandboxes.ALL) {
      dashboard.sandboxes.ALL = {};
    }
    dashboard.sandboxes.ALL[path] = [];
    return;
  }

  const cleanPath = path.split(' ').join('{}');
  try {
    const data = await effects.gql.queries.sandboxesByPath({
      path: '/' + path,
      teamId: state.activeTeam,
    });
    if (typeof data?.me?.collection?.sandboxes === 'undefined') {
      return;
    }

    if (!dashboard.sandboxes.ALL) {
      dashboard.sandboxes.ALL = {};
    }

    dashboard.sandboxes.ALL[cleanPath] = data.me.collection.sandboxes.filter(
      s => !s.customTemplate
    );
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting your sandboxes'
    );
  }
};

export const getReposByPath = async (
  { state, effects }: Context,
  path: string
  // eslint-disable-next-line consistent-return
) => {
  const { dashboard } = state;
  try {
    if (path && dashboard.sandboxes.REPOS) {
      return;
    }
    let sandboxes: RepoFragmentDashboardFragment[];
    if (state.activeTeam) {
      dashboard.sandboxes.REPOS = null;
      const teamData = await effects.gql.queries.getTeamRepos({
        id: state.activeTeam,
      });
      if (!teamData || !teamData.me || !teamData.me.team) {
        return;
      }
      sandboxes = teamData.me.team.sandboxes;
    } else {
      dashboard.sandboxes.REPOS = null;
      const myData = await effects.gql.queries.getPersonalRepos({});

      if (!myData || !myData.me) {
        return;
      }

      sandboxes = myData.me.sandboxes;
    }

    if (!sandboxes) {
      return;
    }

    if (!dashboard.sandboxes.REPOS) {
      dashboard.sandboxes.REPOS = {};
    }

    const repos = sandboxes.reduce((acc, curr) => {
      if (!curr.originalGit || !curr.originalGit.repo) return acc;
      if (acc[curr.originalGit.repo]) {
        const newSandboxes = acc[curr.originalGit.repo].sandboxes.concat(curr);
        acc[curr.originalGit.repo] = {
          ...acc[curr.originalGit.repo],
          sandboxes: newSandboxes,
          lastEdited: newSandboxes
            .map(s => parseISO(s.updatedAt))
            .sort(compareDesc)[0],
        };

        return acc;
      }

      acc[curr.originalGit.repo] = {
        id: curr.originalGit.id,
        name: curr.originalGit.repo,
        branch: curr.originalGit.branch,
        owner: curr.originalGit.username,
        path: '/' + curr.originalGit.repo,
        lastEdited: parseISO(curr.updatedAt),
        sandboxes: [curr],
      };

      return acc;
    }, {});
    dashboard.sandboxes.REPOS = repos;
  } catch (error) {
    effects.notificationToast.error('There was a problem getting your repos');
  }
};

export const getDeletedSandboxes = async ({ state, effects }: Context) => {
  const { dashboard } = state;
  try {
    let sandboxes;

    if (state.activeTeam) {
      const data = await effects.gql.queries.deletedTeamSandboxes({
        teamId: state.activeTeam,
      });

      sandboxes = data?.me?.team?.sandboxes;
    } else {
      const data = await effects.gql.queries.deletedPersonalSandboxes({});

      sandboxes = data?.me?.sandboxes;
    }

    if (!sandboxes) {
      return;
    }

    dashboard.sandboxes[sandboxesTypes.DELETED] = sandboxes;
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting your deleted Sandboxes'
    );
  }
};

export const getTemplateSandboxes = async ({ state, effects }: Context) => {
  const { dashboard } = state;
  try {
    if (state.activeTeam) {
      dashboard.sandboxes[sandboxesTypes.TEMPLATES] = null;
      const data = await effects.gql.queries.teamTemplates({
        id: state.activeTeam,
      });

      if (!data || !data.me || !data.me.team) {
        return;
      }

      dashboard.sandboxes[sandboxesTypes.TEMPLATES] = data.me.team.templates;
    } else {
      dashboard.sandboxes[sandboxesTypes.TEMPLATES] = null;
      const data = await effects.gql.queries.ownedTemplates({
        showAll: false,
      });
      if (!data || !data.me) {
        return;
      }

      dashboard.sandboxes[sandboxesTypes.TEMPLATES] = data.me.templates;
    }
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting your Templates'
    );
  }
};

export const getStartPageSandboxes = async ({ state, effects }: Context) => {
  const { dashboard } = state;

  try {
    /**
     * For now we decided to NOT show the templates on the home page
     * But I would keep this code as it is referenced in a lot of places and (TEMPLATE_HOME)
     * and we might bring it back later on.
     
    const usedTemplates = await effects.gql.queries.listPersonalTemplates({
      teamId: state.activeTeam,
    });
    if (!usedTemplates || !usedTemplates.me) {
      return;
    }
    dashboard.sandboxes.TEMPLATE_HOME = usedTemplates.me.recentlyUsedTemplates.slice(
      0,
      5
    );
    */

    const sandboxesResult = await effects.gql.queries.recentlyAccessedSandboxes(
      {
        limit: 12,
        teamId: state.activeTeam,
      }
    );

    const branchesResult = await effects.gql.queries.recentlyAccessedBranches({
      limit: 12,
      teamId: state.activeTeam,
    });

    dashboard.sandboxes.RECENT_SANDBOXES =
      sandboxesResult?.me?.recentlyAccessedSandboxes || [];
    dashboard.sandboxes.RECENT_BRANCHES =
      branchesResult?.me?.recentBranches || [];
  } catch (error) {
    dashboard.sandboxes.RECENT_SANDBOXES = [];
    dashboard.sandboxes.RECENT_BRANCHES = [];
    effects.notificationToast.error(
      'There was a problem getting your sandboxes'
    );
  }
};

export const deleteTemplateFromState = (
  { state: { dashboard } }: Context,
  ids: string[]
) => {
  const { sandboxes } = dashboard;
  ids.map(id => {
    if (sandboxes.TEMPLATE_HOME) {
      sandboxes.TEMPLATE_HOME = sandboxes.TEMPLATE_HOME
        ? sandboxes.TEMPLATE_HOME.filter(
            ({ sandbox }: TemplateFragmentDashboardFragment) =>
              sandbox && sandbox.id !== id
          )
        : null;
    }

    if (sandboxes.TEMPLATES) {
      sandboxes.TEMPLATES = sandboxes.TEMPLATES
        ? sandboxes.TEMPLATES.filter(
            ({ sandbox }: TemplateFragmentDashboardFragment) =>
              sandbox && sandbox.id !== id
          )
        : null;
    }

    return null;
  });
};

export const deleteSandbox = async (
  { state, effects, actions }: Context,
  {
    ids,
  }: {
    ids: string[];
  }
) => {
  const { user } = state;
  if (!user) return;

  effects.analytics.track('Dashboard - Delete Sandbox', {
    dashboardVersion: 2,
  });
  const oldSandboxes = state.dashboard.sandboxes;
  actions.dashboard.internal.deleteSandboxesFromState({ ids });

  try {
    await effects.gql.mutations.deleteSandboxes({
      sandboxIds: ids,
    });
  } catch (error) {
    state.dashboard.sandboxes = { ...oldSandboxes };

    effects.notificationToast.error(
      'There was a problem deleting your Sandbox'
    );
  }
};

export const unmakeTemplates = async (
  { effects, actions, state }: Context,
  { templateIds }: { templateIds: string[] }
) => {
  const oldTemplates = {
    TEMPLATE_HOME: state.dashboard.sandboxes.TEMPLATE_HOME,
    TEMPLATES: state.dashboard.sandboxes.TEMPLATES,
  };
  actions.dashboard.deleteTemplateFromState(templateIds);
  try {
    await effects.gql.mutations.unmakeSandboxesTemplate({
      sandboxIds: templateIds,
    });
  } catch (error) {
    state.dashboard.sandboxes.TEMPLATES = oldTemplates.TEMPLATES
      ? [...oldTemplates.TEMPLATES]
      : null;
    state.dashboard.sandboxes.TEMPLATE_HOME = oldTemplates.TEMPLATE_HOME
      ? [...oldTemplates.TEMPLATE_HOME]
      : null;
    effects.notificationToast.error(
      'There was a problem reverting your template'
    );
  }
};

export const renameFolderInState = (
  { state: { dashboard } }: Context,
  { path, newPath }: { path: string; newPath: string }
) => {
  if (!dashboard.allCollections) return;
  const newFolders = dashboard.allCollections.map(folder => {
    if (folder.path === path) {
      return getDecoratedCollection({ ...folder, path: newPath });
    }

    return folder;
  });
  dashboard.allCollections = newFolders;
};

export const renameSandbox = async (
  { effects, actions }: Context,
  {
    id,
    title,
  }: {
    id: string;
    title: string;
  }
) => {
  const {
    changedSandboxes,
  } = actions.dashboard.internal.changeSandboxesInState({
    sandboxIds: [id],
    sandboxMutation: sandbox => ({ ...sandbox, title }),
  });

  try {
    await effects.gql.mutations.renameSandbox({
      id,
      title,
    });
  } catch {
    changedSandboxes.forEach(oldSandbox =>
      actions.dashboard.internal.changeSandboxesInState({
        sandboxIds: [oldSandbox.id],
        sandboxMutation: sandbox => ({ ...sandbox, title: oldSandbox.title }),
      })
    );

    effects.notificationToast.error(
      'There was a problem renaming your sandbox'
    );
  }
};

export const moveFolder = async (
  { state: { dashboard }, actions, effects }: Context,
  {
    path,
    newPath,
    teamId,
    newTeamId,
  }: {
    path: string;
    newPath: string;
    newTeamId: string | null;
    teamId: string | null;
  }
) => {
  if (!dashboard.allCollections) return;

  effects.analytics.track('Dashboard - Move Folder', {
    dashboardVersion: 2,
  });
  actions.dashboard.renameFolder({ path, newPath, teamId, newTeamId });
};

export const renameFolder = async (
  { state: { dashboard }, effects, actions }: Context,
  {
    path,
    newPath,
    teamId,
    newTeamId,
  }: {
    path: string;
    newPath: string;
    newTeamId: string | null;
    teamId: string | null;
  }
) => {
  if (!dashboard.allCollections) return;
  actions.dashboard.renameFolderInState({
    path,
    newPath,
  });

  try {
    await effects.gql.mutations.renameFolder({
      path,
      newPath,
      teamId,
      newTeamId,
    });
  } catch {
    actions.dashboard.renameFolderInState({
      path: newPath,
      newPath: path,
    });
    effects.notificationToast.error('There was a problem renaming you folder');
  }
};

export const deleteFolder = async (
  { state: { dashboard, activeTeam }, effects }: Context,
  {
    path,
  }: {
    path: string;
  }
) => {
  if (!dashboard.allCollections) return;
  const oldCollections = dashboard.allCollections;
  dashboard.allCollections = dashboard.allCollections.filter(
    folder => folder.path !== path
  );
  try {
    await effects.gql.mutations.deleteFolder({
      path,
      // only way to pass, null is a value in the BE
      // @ts-ignore
      teamId: activeTeam || undefined,
    });
  } catch {
    dashboard.allCollections = oldCollections;
    effects.notificationToast.error('There was a problem deleting you folder');
  }
};

export const makeTemplates = async (
  { effects, state, actions }: Context,
  {
    sandboxIds: ids,
  }: {
    sandboxIds: string[];
  }
) => {
  effects.analytics.track('Dashboard - Make Template', {
    dashboardVersion: 2,
  });

  const oldSandboxes = state.dashboard.sandboxes;
  actions.dashboard.internal.deleteSandboxesFromState({ ids });

  try {
    await effects.gql.mutations.makeSandboxesTemplate({
      sandboxIds: ids,
    });
  } catch (error) {
    state.dashboard.sandboxes = { ...oldSandboxes };
    effects.notificationToast.error('There was a problem making your template');
  }
};

export const permanentlyDeleteSandboxes = async (
  { effects, state }: Context,
  ids: string[]
) => {
  if (!state.dashboard.sandboxes.DELETED) return;

  effects.analytics.track('Dashboard - Permanent Delete Sandboxes', {
    dashboardVersion: 2,
  });

  const oldDeleted = state.dashboard.sandboxes.DELETED;
  state.dashboard.sandboxes.DELETED = oldDeleted.filter(
    sandbox => !ids.includes(sandbox.id)
  );
  try {
    await effects.gql.mutations.permanentlyDeleteSandboxes({ sandboxIds: ids });
  } catch (error) {
    state.dashboard.sandboxes.DELETED = [...oldDeleted];
    effects.notificationToast.error(
      'There was a problem deleting your sandbox'
    );
  }
};

export const recoverSandboxes = async (
  { effects, state }: Context,
  ids: string[]
) => {
  effects.analytics.track('Dashboard - Recover Sandboxes', {
    dashboardVersion: 2,
  });

  if (!state.dashboard.sandboxes.DELETED) return;
  const oldDeleted = state.dashboard.sandboxes.DELETED;
  state.dashboard.sandboxes.DELETED = oldDeleted.filter(
    sandbox => !ids.includes(sandbox.id)
  );
  try {
    await effects.gql.mutations.addSandboxToFolder({
      sandboxIds: ids,
      collectionPath: '/',
      // only way to pass, null is a value in the BE
      // @ts-ignore
      teamId: state.activeTeam || undefined,
    });
  } catch (error) {
    state.dashboard.sandboxes.DELETED = [...oldDeleted];
    effects.notificationToast.error(
      'There was a problem recovering your sandbox'
    );
  }
};

export const downloadSandboxes = async (
  { effects }: Context,
  ids: string[]
) => {
  effects.analytics.track('Dashboard - Download Sandboxes', {
    dashboardVersion: 2,
  });

  try {
    const sandboxIds = uniq(ids);
    const sandboxes = await Promise.all(
      sandboxIds.map(s => effects.api.getSandbox(s))
    );
    Promise.all(sandboxes.map(s => downloadZip(s, s.modules, s.directories)));
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem reverting your template'
    );
  }
};

export const getSearchSandboxes = async ({ state, effects }: Context) => {
  const { dashboard } = state;
  try {
    const activeTeam = state.activeTeam;

    let sandboxes: SandboxFragmentDashboardFragment[];
    if (activeTeam) {
      const data = await effects.gql.queries.searchTeamSandboxes({
        teamId: activeTeam,
      });
      if (data?.me?.team?.sandboxes == null) {
        return;
      }

      sandboxes = data.me.team.sandboxes;
    } else {
      // This will be gone once we move everyone (even personal spaces) to workspaces
      const data = await effects.gql.queries.searchPersonalSandboxes({});
      if (data?.me?.sandboxes == null) {
        return;
      }

      sandboxes = data.me.sandboxes;
    }

    const sandboxesToShow = state.dashboard
      .getFilteredSandboxes(sandboxes)
      .filter(x => !x.customTemplate);

    dashboard.sandboxes[sandboxesTypes.SEARCH] = sandboxesToShow;
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting your sandboxes'
    );
  }
};

export const getAlwaysOnSandboxes = async ({ state, effects }: Context) => {
  const { dashboard } = state;
  try {
    const activeTeam = state.activeTeam;
    if (!activeTeam) return;

    const data = await effects.gql.queries.alwaysOnTeamSandboxes({
      teamId: activeTeam,
    });

    if (data?.me?.team?.sandboxes == null) return;

    dashboard.sandboxes[sandboxesTypes.ALWAYS_ON] = data.me.team.sandboxes;
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting your sandboxes'
    );
  }
};

export const getPage = async (
  { actions, state }: Context,
  page: sandboxesTypes
) => {
  const { dashboard } = actions;

  switch (page) {
    case sandboxesTypes.RECENT:
      dashboard.getStartPageSandboxes();
      break;
    case sandboxesTypes.DELETED:
      dashboard.getDeletedSandboxes();
      break;
    case sandboxesTypes.DRAFTS:
      dashboard.getDrafts();
      break;
    case sandboxesTypes.TEMPLATES:
      dashboard.getTemplateSandboxes();
      break;
    case sandboxesTypes.SEARCH:
      dashboard.getSearchSandboxes();
      if (state.activeTeam) {
        dashboard.getRepositoriesByTeam({
          teamId: state.activeTeam,
        });
      }
      break;
    case sandboxesTypes.ALWAYS_ON:
      dashboard.getAlwaysOnSandboxes();
      break;
    case sandboxesTypes.SHARED:
      dashboard.getSharedSandboxes();
      break;
    case sandboxesTypes.LIKED:
      dashboard.getLikedSandboxes();
      break;

    case sandboxesTypes.DISCOVER:
      dashboard.getCuratedAlbums();
      break;

    default:
      break;
  }
};

export const addSandboxesToFolder = async (
  { state, effects, actions }: Context,
  {
    sandboxIds,
    collectionPath,
    teamId = state.activeTeam,
    deleteFromCurrentPath = true,
  }: {
    sandboxIds: string[];
    collectionPath: string | null;
    teamId?: string | null;
    deleteFromCurrentPath?: boolean;
  }
) => {
  effects.analytics.track('Dashboard - Moved Sandboxes', {
    dashboardVersion: 2,
  });

  const oldSandboxes = state.dashboard.sandboxes;
  if (deleteFromCurrentPath) {
    actions.dashboard.internal.deleteSandboxesFromState({ ids: sandboxIds });
  }

  const existingCollection = state.dashboard?.allCollections?.find(
    f => f.path === collectionPath
  );
  if (existingCollection) {
    existingCollection.sandboxCount += sandboxIds.length;
  }

  if (teamId !== state.activeTeam) {
    effects.analytics.track('Dashboard - Moved Sandboxes to different team', {
      dashboardVersion: 2,
    });
  }

  try {
    await effects.gql.mutations.addSandboxToFolder({
      sandboxIds,
      collectionPath,
      teamId,
    });

    if (collectionPath) {
      // Prefetch that folder
      actions.dashboard.getSandboxesByPath(collectionPath.replace(/^\//, ''));
    } else {
      actions.dashboard.getPage(sandboxesTypes.DRAFTS);
    }
  } catch (e) {
    state.dashboard.sandboxes = { ...oldSandboxes };
    effects.notificationToast.error('There was a problem moving your sandbox');
  }
};

export const createTeam = async (
  { effects, actions, state }: Context,
  {
    teamName,
  }: {
    teamName: string;
  }
) => {
  try {
    effects.analytics.track('Team - Create Team', { dashboardVersion: 2 });
    const { createTeam: newTeam } = await effects.gql.mutations.createTeam({
      name: teamName,
    });
    state.dashboard.teams = [...state.dashboard.teams, newTeam];
    actions.setActiveTeam({ id: newTeam.id });
  } catch {
    effects.notificationToast.error('There was a problem creating your team');
  }
};

export const revokeTeamInvitation = async (
  { effects, state }: Context,
  {
    teamId,
    userId,
  }: {
    teamId: string;
    userId: string;
  }
) => {
  const oldInvitees = state.activeTeamInfo!.invitees;
  const user = state.activeTeamInfo!.invitees.find(f => f.id === userId);
  state.activeTeamInfo!.invitees = state.activeTeamInfo!.invitees.filter(
    f => f.id !== userId
  );

  try {
    const result = await effects.gql.mutations.revokeTeamInvitation({
      userId,
      teamId,
    });

    state.activeTeamInfo = result.revokeTeamInvitation;

    let successMessage = 'Successfully revoked invitation';
    if (user) {
      successMessage += ` to ${user.username}`;
    }
    effects.notificationToast.success(successMessage);
  } catch (e) {
    state.activeTeamInfo!.invitees = oldInvitees;
  }
};

export const setTeamInfo = async (
  { effects, state, actions }: Context,
  {
    name,
    description,
    file,
  }: {
    name: string;
    description: string | null;
    file: { name: string; url: string } | null;
  }
) => {
  if (!state.activeTeam) return;

  effects.analytics.track('Team - Update Info', {
    dashboardVersion: 2,
  });

  const oldTeamInfo = state.dashboard.teams.find(
    team => team.id === state.activeTeam
  );
  const oldActiveTeamInfo = state.activeTeamInfo;
  try {
    await effects.gql.mutations.setTeamName({
      name,
      // only way to pass, null is a value in the BE
      // @ts-ignore
      teamId: state.activeTeam,
    });

    if (description) {
      await effects.gql.mutations.setTeamDescription({
        description,
        // only way to pass, null is a value in the BE
        // @ts-ignore
        teamId: state.activeTeam,
      });
    }

    if (file) {
      await actions.dashboard.updateTeamAvatar({
        ...file,
        teamId: state.activeTeam,
      });
    }
    state.dashboard.teams = state.dashboard.teams.map(team => {
      if (oldTeamInfo && team.id === oldTeamInfo.id) {
        return {
          ...team,
          name,
          description,
          avatarUrl: file ? file.url : team.avatarUrl,
        };
      }

      return team;
    });

    if (oldActiveTeamInfo) {
      state.activeTeamInfo = {
        ...oldActiveTeamInfo,
        name,
        description,
        avatarUrl: file ? file.url : oldActiveTeamInfo.avatarUrl,
      };
    }
  } catch (e) {
    if (oldActiveTeamInfo) {
      state.activeTeamInfo = { ...oldActiveTeamInfo };
    }
    if (state.dashboard.teams && oldTeamInfo) {
      state.dashboard.teams = [...state.dashboard.teams, oldTeamInfo];
    }
    actions.internal.handleError({
      message: 'There was a problem renaming your team',
      error: e,
    });
  }
};

export const changeSandboxesFrozen = async (
  { actions, effects }: Context,
  {
    sandboxIds,
    isFrozen,
  }: {
    sandboxIds: string[];
    isFrozen: boolean;
  }
) => {
  effects.analytics.track('Sandbox - Update Frozen', {
    isFrozen,
    source: 'dashboard',
    dashboardVersion: 2,
  });

  // optimistic update
  const {
    changedSandboxes,
  } = actions.dashboard.internal.changeSandboxesInState({
    sandboxIds,
    sandboxMutation: sandbox => ({ ...sandbox, isFrozen }),
  });

  try {
    await effects.gql.mutations.changeFrozen({ sandboxIds, isFrozen });
  } catch (error) {
    changedSandboxes.forEach(oldSandbox =>
      actions.dashboard.internal.changeSandboxesInState({
        sandboxIds: [oldSandbox.id],
        sandboxMutation: sandbox => ({
          ...sandbox,
          isFrozen: oldSandbox.isFrozen,
        }),
      })
    );

    actions.internal.handleError({
      message: "We weren't able to update the frozen status of the sandboxes",
      error,
    });
  }
};

export const changeSandboxesPrivacy = async (
  { actions, effects }: Context,
  {
    sandboxIds,
    privacy,
  }: {
    sandboxIds: string[];
    privacy: 0 | 1 | 2;
  }
) => {
  effects.analytics.track('Sandbox - Update Privacy', {
    privacy,
    source: 'dashboard',
    dashboardVersion: 2,
  });

  // optimistic update
  const {
    changedSandboxes,
  } = actions.dashboard.internal.changeSandboxesInState({
    sandboxIds,
    sandboxMutation: sandbox => ({ ...sandbox, privacy }),
  });

  try {
    await effects.gql.mutations.changePrivacy({ sandboxIds, privacy });
  } catch (error) {
    changedSandboxes.forEach(oldSandbox => {
      actions.dashboard.internal.changeSandboxesInState({
        sandboxIds: [oldSandbox.id],
        sandboxMutation: s => ({ ...s, privacy: oldSandbox.privacy }),
      });
    });

    actions.internal.handleError({
      message: "We weren't able to update the sandbox privacy",
      error,
    });
  }
};

export const updateTeamAvatar = async (
  { actions, effects, state }: Context,
  {
    name,
    url,
    teamId,
  }: {
    name: string;
    url: string;
    teamId: string;
  }
) => {
  if (!state.activeTeamInfo || !state.user) return;
  const oldAvatar = state.activeTeamInfo.avatarUrl;
  const isPersonalWorkspace =
    state.activeTeamInfo.id === state.personalWorkspaceId;
  state.activeTeamInfo.avatarUrl = url;
  if (isPersonalWorkspace) {
    state.user.avatarUrl = url;
  }

  effects.analytics.track('Team - Update Team Avatar', { dashboardVersion: 2 });

  try {
    await effects.api.updateTeamAvatar(name, url, teamId);
  } catch (error) {
    state.activeTeamInfo.avatarUrl = oldAvatar;
    if (isPersonalWorkspace) {
      // @ts-ignore
      state.user.avatarUrl = oldAvatar;
    }

    actions.internal.handleError({
      message: "We weren't able to update your team avatar",
      error,
    });
  }
};

export const changeAuthorizationInState = (
  { state }: Context,
  {
    userId,
    authorization,
  }: {
    userId: string;
    authorization: TeamMemberAuthorization;
  }
) => {
  const userAuthorizations = state.activeTeamInfo!.userAuthorizations.map(
    user => {
      if (user.userId === userId) return { ...user, authorization };
      return user;
    }
  );

  state.activeTeamInfo!.userAuthorizations = userAuthorizations;
};

export const changeAuthorization = async (
  { state, effects, actions }: Context,
  {
    userId,
    authorization,
    confirm,
  }: {
    userId: string;
    authorization: TeamMemberAuthorization;
    confirm?: Boolean;
  }
) => {
  if (confirm) {
    const confirmed = await actions.modals.alertModal.open({
      title: 'Change Authorization',
      customComponent: 'MemberPaymentConfirmation',
    });

    // if the user cancels the function, bail
    if (!confirmed) return;
  }

  // optimistic update
  const oldAuthorization = state.activeTeamInfo!.userAuthorizations.find(
    user => user.userId === userId
  )!.authorization;

  actions.dashboard.changeAuthorizationInState({ userId, authorization });

  try {
    await effects.gql.mutations.changeTeamMemberAuthorization({
      teamId: state.activeTeam!,
      userId,
      authorization,
    });
    actions.getActiveTeamInfo();
  } catch (e) {
    let message = 'There has been a problem changing user authorization.';
    if (e?.response?.errors) {
      message += ' ' + e.response.errors.map(error => error.message).join(', ');
    }

    effects.notificationToast.error(message);

    // undo optimistic update
    actions.dashboard.changeAuthorizationInState({
      userId,
      authorization: oldAuthorization,
    });
  }
};

export const deleteCurrentNpmRegistry = async (
  { state, actions, effects }: Context,
  params: Omit<DeleteNpmRegistryMutationVariables, 'teamId'>
) => {
  const confirmed = await actions.modals.alertModal.open({
    title: 'Are you sure?',
    message: 'This will reset the current private npm registry information.',
  });
  if (confirmed) {
    try {
      await effects.gql.mutations.deleteNpmRegistry({
        ...params,
        teamId: state.activeTeam,
      });

      await actions.dashboard.fetchCurrentNpmRegistry();

      effects.notificationToast.success('Successfully reset the registry!');
    } catch (e) {
      actions.internal.handleError({
        message: 'There was a problem resetting the registry settings',
        error: e,
      });
    }
  }
};

export const createOrUpdateCurrentNpmRegistry = async (
  { state, actions, effects }: Context,
  params: Omit<CreateOrUpdateNpmRegistryMutationVariables, 'teamId'>
) => {
  try {
    await effects.gql.mutations.createOrUpdateNpmRegistry({
      ...params,
      teamId: state.activeTeam,
    });

    await actions.dashboard.fetchCurrentNpmRegistry();

    effects.notificationToast.success(
      'Successfully saved new registry settings!'
    );
  } catch (e) {
    actions.internal.handleError({
      message: 'There was a problem saving the registry settings',
      error: e,
    });
  }
};

export const deleteWorkspace = async ({ actions, effects, state }: Context) => {
  if (!state.activeTeamInfo) return;

  try {
    await effects.gql.mutations.deleteWorkspace({ teamId: state.activeTeam });

    actions.modalClosed();
    actions.setActiveTeam({ id: state.personalWorkspaceId! });
    effects.router.redirectToDashboard();
    actions.dashboard.getTeams();

    effects.notificationToast.success(`Your workspace was deleted`);
  } catch (error) {
    // this is odd to handle it in the action
    // TODO: we need a cleaner way to read graphql errors
    const message = error.response?.errors[0]?.message;

    actions.internal.handleError({
      message: 'There was a problem deleting your workspace',
      error: { name: 'Delete workspace', message },
    });
  }
};

export const fetchCurrentNpmRegistry = async ({
  state,
  effects,
  actions,
}: Context) => {
  const activeTeam = state.activeTeam;
  if (!activeTeam) {
    return;
  }

  try {
    const data = await effects.gql.queries.getPrivateNpmRegistry({
      teamId: activeTeam,
    });

    // Check if active team is still the same
    if (activeTeam === state.activeTeam) {
      state.dashboard.workspaceSettings.npmRegistry =
        data.me?.team?.privateRegistry || null;
    }
  } catch (error) {
    actions.internal.handleError({
      message: 'There was a problem fetcing the registry',
      error,
    });
  }
};

export const setTeamMinimumPrivacy = async (
  { state, effects }: Context,
  {
    teamId,
    minimumPrivacy,
    updateDrafts = false,
    source,
  }: {
    teamId: string;
    minimumPrivacy: SandboxFragmentDashboardFragment['privacy'];
    updateDrafts?: boolean;
    source: 'Dashboard' | 'Profiles';
  }
) => {
  effects.analytics.track('Team - Change minimum privacy', {
    minimumPrivacy,
    source,
  });

  try {
    await effects.gql.mutations.setTeamMinimumPrivacy({
      teamId,
      minimumPrivacy,
      updateDrafts,
    });

    const selectedTeam = state.dashboard.teams.find(
      team => team.id === state.personalWorkspaceId
    );

    if (selectedTeam && selectedTeam.settings) {
      selectedTeam.settings.minimumPrivacy = minimumPrivacy;
    }

    if (source === 'Dashboard') {
      effects.notificationToast.success('Minimum privacy updated.');
    }
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem updating your settings'
    );
  }
};

export const setWorkspaceSandboxSettings = async (
  { state, effects }: Context,
  {
    preventSandboxLeaving,
    preventSandboxExport,
  }: {
    preventSandboxLeaving: boolean;
    preventSandboxExport: boolean;
  }
) => {
  if (!state.activeTeamInfo || !state.activeTeamInfo.settings) return;

  const teamId = state.activeTeam;
  // optimistic update
  const oldLeavingValue = state.activeTeamInfo.settings.preventSandboxLeaving;
  const oldExportValue = state.activeTeamInfo.settings.preventSandboxExport;
  state.activeTeamInfo.settings.preventSandboxLeaving = preventSandboxLeaving;
  state.activeTeamInfo.settings.preventSandboxExport = preventSandboxExport;

  effects.analytics.track('Team - Change workspace sandbox permissions', {
    preventSandboxLeaving,
    preventSandboxExport,
  });

  try {
    await effects.gql.mutations.setWorkspaceSandboxSettings({
      teamId,
      preventSandboxLeaving,
      preventSandboxExport,
    });

    effects.notificationToast.success('Workspace sandbox permissions updated.');
  } catch (error) {
    state.activeTeamInfo.settings.preventSandboxLeaving = oldLeavingValue;
    state.activeTeamInfo.settings.preventSandboxExport = oldExportValue;

    effects.notificationToast.error(
      'There was a problem updating your workspace settings'
    );
  }
};

export const setPreventSandboxesLeavingWorkspace = async (
  { state, actions, effects }: Context,
  {
    sandboxIds,
    preventSandboxLeaving,
  }: {
    sandboxIds: string[];
    preventSandboxLeaving: boolean;
  }
) => {
  const {
    changedSandboxes,
  } = actions.dashboard.internal.changeSandboxesInState({
    sandboxIds,
    sandboxMutation: sandbox => ({
      ...sandbox,
      permissions: { ...sandbox.permissions, preventSandboxLeaving },
    }),
  });

  effects.analytics.track(`Dashboard - Change sandbox permissions`, {
    preventSandboxLeaving,
  });

  try {
    await effects.gql.mutations.setPreventSandboxesLeavingWorkspace({
      sandboxIds,
      preventSandboxLeaving,
    });

    effects.notificationToast.success('Sandbox permissions updated.');
  } catch (error) {
    changedSandboxes.forEach(oldSandbox =>
      actions.dashboard.internal.changeSandboxesInState({
        sandboxIds: [oldSandbox.id],
        sandboxMutation: sandbox => ({
          ...sandbox,
          permissions: { ...oldSandbox.permissions },
        }),
      })
    );
    effects.notificationToast.error(
      'There was a problem updating your sandbox permissions'
    );
  }
};

export const setPreventSandboxesExport = async (
  { state, actions, effects }: Context,
  {
    sandboxIds,
    preventSandboxExport,
  }: {
    sandboxIds: string[];
    preventSandboxExport: boolean;
  }
) => {
  // optimistic update
  const {
    changedSandboxes,
  } = actions.dashboard.internal.changeSandboxesInState({
    sandboxIds,
    sandboxMutation: sandbox => ({
      ...sandbox,
      permissions: { ...sandbox.permissions, preventSandboxExport },
    }),
  });

  effects.analytics.track(`Dashboard - Change sandbox permissions`, {
    preventSandboxExport,
  });

  try {
    await effects.gql.mutations.setPreventSandboxesExport({
      sandboxIds,
      preventSandboxExport,
    });

    effects.notificationToast.success('Sandbox permissions updated.');
  } catch (error) {
    changedSandboxes.forEach(oldSandbox =>
      actions.dashboard.internal.changeSandboxesInState({
        sandboxIds: [oldSandbox.id],
        sandboxMutation: sandbox => ({
          ...sandbox,
          permissions: { ...oldSandbox.permissions },
        }),
      })
    );
    effects.notificationToast.error(
      'There was a problem updating your sandbox permissions'
    );
  }
};

export const setDefaultTeamMemberAuthorization = async (
  { state, effects }: Context,
  {
    defaultAuthorization,
  }: {
    defaultAuthorization: TeamMemberAuthorization;
  }
) => {
  if (!state.activeTeamInfo || !state.activeTeamInfo.settings) return;

  const teamId = state.activeTeam;

  // optimistic update
  const oldValue = state.activeTeamInfo.settings.defaultAuthorization;
  state.activeTeamInfo.settings.defaultAuthorization = defaultAuthorization;

  effects.analytics.track('Team - Change default authorization', {
    defaultAuthorization,
  });

  try {
    await effects.gql.mutations.setDefaultTeamMemberAuthorization({
      teamId,
      defaultAuthorization,
    });

    effects.notificationToast.success('Default member permissions updated.');
  } catch (error) {
    state.activeTeamInfo.settings.defaultAuthorization = oldValue;

    effects.notificationToast.error(
      'There was a problem updating default member permissions'
    );
  }
};

export const requestAccountClosing = ({ state }: Context) => {
  state.currentModal = 'accountClosing';
};
export const undoRequestAccountClosing = ({ state }: Context) => {
  state.currentModal = 'undoAccountClosing';
};

export const undoDeleteAccount = async ({ state, effects }: Context) => {
  try {
    await effects.gql.mutations.undoDeleteAccount({});
    state.currentModal = 'undoDeleteConfirmation';
    if (state.user) {
      state.user.deletionRequested = false;
    }
  } catch {
    effects.notificationToast.error(
      'There was a problem undoing your account deletion. Please email us at support@codesandbox.io'
    );
  }
};

export const deleteAccount = async ({ state, effects }: Context) => {
  try {
    await effects.gql.mutations.deleteAccount({});
    state.currentModal = 'deleteConfirmation';
  } catch {
    effects.notificationToast.error(
      'There was a problem requesting your account deletion. Please email us at support@codesandbox.io'
    );
  }
};

export const getSharedSandboxes = async ({ state, effects }: Context) => {
  const { dashboard } = state;
  try {
    const data = await effects.gql.queries.sharedWithmeSandboxes({});

    if (!data.me?.collaboratorSandboxes) {
      return;
    }

    dashboard.sandboxes[sandboxesTypes.SHARED] = data.me?.collaboratorSandboxes;
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting Sandboxes shared with you'
    );
  }
};

export const getLikedSandboxes = async ({ state, effects }: Context) => {
  const { dashboard } = state;
  try {
    const data = await effects.gql.queries.likedSandboxes({});

    if (!data.me?.likedSandboxes) {
      return;
    }

    dashboard.sandboxes[sandboxesTypes.LIKED] = data.me?.likedSandboxes;
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting liked Sandboxes'
    );
  }
};

export const unlikeSandbox = async (
  { state, effects }: Context,
  id: string
) => {
  const all = state.dashboard.sandboxes[sandboxesTypes.LIKED];
  if (!all) return;
  try {
    state.dashboard.sandboxes[sandboxesTypes.LIKED] = all.filter(
      sandbox => sandbox.id !== id
    );
    await effects.api.unlikeSandbox(id);
  } catch (e) {
    state.dashboard.sandboxes[sandboxesTypes.LIKED] = json(all);
    effects.notificationToast.error('There was a problem removing your like');
  }
};

export const likeCommunitySandbox = async (
  { actions, effects }: Context,
  id: string
) => {
  try {
    // we don't have optimistic updates because the shape of
    // a liked sandbox is not the same as a community sandbox
    // so we refetch liked sandboxes from the api
    await effects.api.likeSandbox(id);
    actions.dashboard.getLikedSandboxes();
  } catch (e) {
    effects.notificationToast.error('There was a problem liking the sandbox');
  }
};

export const getCuratedAlbums = async ({ state, effects }: Context) => {
  const { dashboard } = state;
  try {
    const data = await effects.gql.queries.curatedAlbums({});
    dashboard.curatedAlbums = data.curatedAlbums;
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting curated collections'
    );
  }
};

export const addSandboxesToAlbum = async (
  { actions, effects }: Context,
  { albumId, sandboxIds }: { albumId: string; sandboxIds: string[] }
) => {
  try {
    await effects.gql.mutations.addSandboxesToAlbum({
      albumId,
      sandboxIds,
    });
    actions.dashboard.getCuratedAlbums();
  } catch (error) {
    effects.notificationToast.error('There was a problem updating albums');
  }
};

export const removeSandboxesFromAlbum = async (
  { actions, effects }: Context,
  { albumId, sandboxIds }: { albumId: string; sandboxIds: string[] }
) => {
  try {
    await effects.gql.mutations.removeSandboxesFromAlbum({
      albumId,
      sandboxIds,
    });
    actions.dashboard.getCuratedAlbums();
  } catch (error) {
    effects.notificationToast.error('There was a problem updating albums');
  }
};

export const createAlbum = async (
  { state, effects }: Context,
  { title }: { title: string }
) => {
  try {
    const data = await effects.gql.mutations.createAlbum({ title });
    state.dashboard.curatedAlbums.push({
      id: data.createAlbum.id,
      title: data.createAlbum.title,
      sandboxes: [],
    });
  } catch (error) {
    effects.notificationToast.error('There was a problem updating album');
  }
};

export const updateAlbum = async (
  { state, effects }: Context,
  { id, title }: { id: string; title: string }
) => {
  try {
    await effects.gql.mutations.updateAlbum({ id, title });
    state.dashboard.curatedAlbums = state.dashboard.curatedAlbums.map(album => {
      if (album.id === id) album.title = title;
      return album;
    });
  } catch (error) {
    effects.notificationToast.error('There was a problem updating album');
  }
};

export const getContributionBranches = async ({ state, effects }: Context) => {
  const { dashboard } = state;
  try {
    dashboard.contributions = null;

    const contributionsData = await effects.gql.queries.getContributionBranches(
      {}
    );
    const contributionBranches = contributionsData?.me?.recentBranches;
    if (!contributionBranches) {
      return;
    }

    dashboard.contributions = contributionBranches;
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting your open source contributions'
    );
  }
};

type RepositoriesActionOptions = {
  teamId: string;
  fetchCachedDataFirst?: boolean;
};
export const getRepositoriesByTeam = async (
  { state, effects, actions }: Context,
  { teamId, fetchCachedDataFirst = false }: RepositoriesActionOptions
) => {
  const { dashboard } = state;

  try {
    // syncData: true tells backend to return the repositories from the cache,
    // avoiding the GitHub API for the request
    const response = await effects.gql.queries.getRepositoriesByTeam({
      teamId,
      syncData: !fetchCachedDataFirst,
    });
    const repositories = response?.me?.team?.projects;
    if (!repositories) {
      return;
    }

    dashboard.repositoriesByTeamId = {
      ...dashboard.repositoriesByTeamId,
      [teamId]: repositories.sort(sortByNameAscending),
    };

    // If fetchCachedDataFirst was true, the initial call was made (faster), so we can
    // safely trigger the second call to sync with GitHub (slower)
    if (fetchCachedDataFirst) {
      actions.dashboard.getRepositoriesByTeam({
        teamId,
      });
    }
  } catch (error) {
    if (!fetchCachedDataFirst && error?.response?.status === 504) {
      // Fail silently for timeout requests (unlikely to happen anymore)
      return;
    }

    if (fetchCachedDataFirst) {
      effects.notificationToast.error(
        'There was a problem getting your repositories'
      );
    } else {
      effects.notificationToast.error(
        'There was a problem syncing your repositories with GitHub, data shown might not be up to date'
      );
    }
  }
};

// Fetch the repository with all its branches
// Cached by `team/owner/name` key
export const getRepositoryWithBranches = async (
  { state, effects }: Context,
  {
    activeTeam,
    owner,
    name,
  }: { activeTeam: string; owner: string; name: string }
) => {
  const { dashboard } = state;

  const repoKey = getProjectUniqueKey({ teamId: activeTeam, owner, name });

  try {
    const repositoryData = await effects.gql.queries.getRepositoryByDetails({
      owner,
      name,
      teamId: activeTeam,
    });
    const repository = repositoryData?.project;
    if (!repository) {
      return;
    }

    dashboard.repositoriesWithBranches = {
      ...dashboard.repositoriesWithBranches,
      [repoKey]: repository,
    };
  } catch (error) {
    effects.notificationToast.error(
      `There was a problem getting repository ${name} from ${owner}`
    );
  }
};

export const getStarredRepos = ({ state, effects }: Context) => {
  const { dashboard, activeTeam } = state;

  const persistedStarredRepos = effects.browser.storage.get(
    `CSB/EXPERIMENTAL_STARRED/${activeTeam}`
  ) as Array<{ owner: string; name: string }>;

  dashboard.starredRepos = persistedStarredRepos ?? [];
};

export const starRepo = (
  { state, effects }: Context,
  { owner, name }: { owner: string; name: string }
) => {
  const { dashboard, activeTeam } = state;

  const existingRepo = dashboard.starredRepos.find(
    repo => repo.owner === owner && repo.name === name
  );
  if (existingRepo) {
    return;
  }

  dashboard.starredRepos.push({ owner, name });
  effects.browser.storage.set(
    `CSB/EXPERIMENTAL_STARRED/${activeTeam}`,
    dashboard.starredRepos
  );
};

export const unstarRepo = (
  { state, effects }: Context,
  { owner, name }: { owner: string; name: string }
) => {
  const { dashboard, activeTeam } = state;

  dashboard.starredRepos = dashboard.starredRepos.filter(
    repo => repo.owner !== owner || repo.name !== name
  );
  effects.browser.storage.set(
    `CSB/EXPERIMENTAL_STARRED/${activeTeam}`,
    dashboard.starredRepos
  );
};

type BranchToRemove = {
  owner: string;
  repoName: string;
  name: string;
  id: string;
  page: PageTypes;
};
export const removeBranchFromRepository = async (
  { actions, effects, state }: Context,
  branch: BranchToRemove
) => {
  const { activeTeam, dashboard } = state;
  if (!activeTeam) {
    return;
  }
  const { id, owner, repoName, name, page } = branch;

  dashboard.removingBranch = { id };

  try {
    await effects.api.removeBranchFromRepository(
      activeTeam,
      owner,
      repoName,
      name
    );

    // Clean the branch references from all possible locations in the state
    // 1. Repository with branches
    // 2. Contribution branches
    // 3. Recent branches
    const key = getProjectUniqueKey({
      teamId: activeTeam,
      owner,
      name: repoName,
    });
    const repository = dashboard.repositoriesWithBranches[key];

    if (repository) {
      dashboard.repositoriesWithBranches = {
        ...dashboard.repositoriesWithBranches,
        [key]: {
          ...repository,
          branches: repository.branches.filter(b => b.id !== id),
        },
      };
    }

    dashboard.contributions =
      dashboard.contributions?.filter(b => b.id !== id) ?? [];

    dashboard.sandboxes.RECENT_BRANCHES =
      dashboard.sandboxes.RECENT_BRANCHES?.filter(b => b.id !== id) ?? [];

    if (page === 'recent') {
      // Trigger re-fetching of recent page data to fill in the free spot
      actions.dashboard.getStartPageSandboxes();
    }
  } catch (error) {
    effects.notificationToast.error(
      `Failed to remove branch ${name} from ${owner}/${repoName}`
    );
  } finally {
    dashboard.removingBranch = null;
  }
};

type ProjectToRemove = {
  owner: string;
  name: string;
  teamId: string;
  page: PageTypes;
};
export const removeRepositoryFromTeam = async (
  { actions, state, effects }: Context,
  project: ProjectToRemove
) => {
  const { activeTeam, dashboard } = state;
  if (!activeTeam) {
    return;
  }

  const { owner, name, teamId, page } = project;

  dashboard.removingRepository = { owner, name };

  try {
    await effects.api.removeRepositoryFromTeam(owner, name, teamId);

    // Remove all cached data about repository
    // 1. From repositories list
    // 2. From repository with branches cache
    // 3. Branches from recent page

    const teamRepositories = dashboard.repositoriesByTeamId[activeTeam];
    if (teamRepositories) {
      dashboard.repositoriesByTeamId = {
        ...dashboard.repositoriesByTeamId,
        [activeTeam]: teamRepositories.filter(
          r => r.repository.owner !== owner || r.repository.name !== name
        ),
      };
    }

    const key = getProjectUniqueKey({ teamId, owner, name });
    const repositoryWithBranches = dashboard.repositoriesWithBranches[key];
    if (repositoryWithBranches) {
      dashboard.repositoriesWithBranches = {
        ...dashboard.repositoriesWithBranches,
        [key]: undefined,
      };
    }

    dashboard.sandboxes.RECENT_BRANCHES =
      dashboard.sandboxes.RECENT_BRANCHES?.filter(b => {
        const branchRepo = b.project.repository;

        return branchRepo.owner === owner && branchRepo.name === name;
      }) ?? [];

    // Refetch start page data in the background to fill the remaining slots
    if (page === 'recent') {
      actions.dashboard.getStartPageSandboxes();
    }

    // Redirect to main dashboard page when removing the repo from within the page
    if (page === 'repository-branches') {
      effects.router.redirectToDashboard();
    }
  } catch (error) {
    effects.notificationToast.error(
      `Failed to remove project ${owner}/${name}`
    );
  } finally {
    dashboard.removingRepository = null;
  }
};

export const importGitHubRepository = async (
  { state, effects }: Context,
  { owner, name }: { owner: string; name: string }
) => {
  const { activeTeam } = state;
  if (!activeTeam) {
    return;
  }

  try {
    await effects.gql.mutations.importProject({
      name,
      owner,
      teamId: activeTeam,
    });

    // TODO: Add teamId in the url path
    // First needs the v2 editor to support that
    window.location.href = v2DraftBranchUrl(owner, name);
  } catch (error) {
    notificationState.addNotification({
      message: JSON.stringify(error),
      title: 'Failed to import repository',
      status: NotificationStatus.ERROR,
    });
  }
};

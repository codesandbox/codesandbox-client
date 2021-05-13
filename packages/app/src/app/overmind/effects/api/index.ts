import { TemplateType } from '@codesandbox/common/lib/templates';
import {
  CurrentUser,
  CustomTemplate,
  Dependency,
  Directory,
  EnvironmentVariable,
  GitChanges,
  GitCommit,
  GitFileCompare,
  GitInfo,
  GitPathChanges,
  GitPr,
  Module,
  NpmManifest,
  PaymentDetails,
  PickedSandboxes,
  PopularSandboxes,
  Profile,
  Sandbox,
  SandboxPick,
  UploadedFilesInfo,
  UserQuery,
  UserSandbox,
  SettingsSync,
} from '@codesandbox/common/lib/types';
import { LIST_PERSONAL_TEMPLATES } from 'app/components/CreateNewSandbox/queries';
import { client } from 'app/graphql/client';
import { PendingUserType } from 'app/overmind/state';

import {
  transformDirectory,
  transformModule,
  transformSandbox,
} from '../utils/sandbox';
import apiFactory, { Api, ApiConfig, Params } from './apiFactory';
import {
  IDirectoryAPIResponse,
  IModuleAPIResponse,
  SandboxAPIResponse,
  AvatarAPIResponse,
} from './types';

let api: Api;

export default {
  initialize(config: ApiConfig) {
    api = apiFactory(config);
  },
  async getAuthToken(): Promise<string> {
    const response = await api.get<{ token: string }>('/auth/auth-token');

    return response.token;
  },
  async getJWTToken(): Promise<string> {
    const response = await api.get<{ jwt: string }>('/auth/jwt');

    return response.jwt;
  },
  createPatronSubscription(
    token: string,
    amount: number,
    duration: 'monthly' | 'yearly',
    coupon: string
  ) {
    return api.post<CurrentUser>('/users/current_user/subscription', {
      subscription: {
        amount,
        coupon,
        token,
        duration,
      },
    });
  },
  updatePatronSubscription(amount: number, coupon: string) {
    return api.patch<CurrentUser>('/users/current_user/subscription', {
      subscription: {
        amount,
        coupon,
      },
    });
  },
  cancelPatronSubscription() {
    return api.delete<CurrentUser>('/users/current_user/subscription');
  },
  getCurrentUser(): Promise<CurrentUser> {
    return api.get('/users/current');
  },
  markSurveySeen(): Promise<void> {
    return api.post('/users/survey-seen', {});
  },
  revokeToken(token: string): Promise<void> {
    return api.delete(`/auth/revoke/${token}`);
  },
  getDependency(name: string, tag: string): Promise<Dependency> {
    return api.get(`/dependencies/${name}@${tag}`);
  },
  getDependencyManifest(sandboxId: string, name: string): Promise<NpmManifest> {
    return api.get(
      `/sandboxes/${sandboxId}/npm_registry/${name.replace('/', '%2f')}`
    );
  },
  async getSandbox(id: string, params?: Params): Promise<Sandbox> {
    const sandbox = await api.get<SandboxAPIResponse>(
      `/sandboxes/${id}`,
      params
    );

    // We need to add client side properties for tracking
    return transformSandbox(sandbox);
  },
  async forkSandbox(id: string, body?: unknown): Promise<Sandbox> {
    const url = id.includes('/')
      ? `/sandboxes/fork/${id}`
      : `/sandboxes/${id}/fork`;

    const sandbox = await api.post<SandboxAPIResponse>(url, body || {});

    return transformSandbox(sandbox);
  },
  createModule(sandboxId: string, module: Module): Promise<Module> {
    return api
      .post<IModuleAPIResponse>(`/sandboxes/${sandboxId}/modules`, {
        module: {
          title: module.title,
          directoryShortid: module.directoryShortid,
          code: module.code,
          isBinary: module.isBinary === undefined ? false : module.isBinary,
        },
      })
      .then(transformModule);
  },
  async deleteModule(sandboxId: string, moduleShortid: string): Promise<void> {
    await api.delete<IModuleAPIResponse>(
      `/sandboxes/${sandboxId}/modules/${moduleShortid}`
    );
  },
  saveModuleCode(
    sandboxId: string,
    moduleShortid: string,
    code: string
  ): Promise<Module> {
    return api
      .put<IModuleAPIResponse>(
        `/sandboxes/${sandboxId}/modules/${moduleShortid}`,
        {
          module: { code },
        }
      )
      .then(transformModule);
  },
  saveModulePrivateUpload(
    sandboxId: string,
    moduleShortid: string,
    data: {
      code: string;
      uploadId: string;
      sha: string;
    }
  ): Promise<Module> {
    return api
      .put<IModuleAPIResponse>(
        `/sandboxes/${sandboxId}/modules/${moduleShortid}`,
        {
          module: data,
        }
      )
      .then(transformModule);
  },
  saveModules(sandboxId: string, modules: Module[]): Promise<Module[]> {
    return api
      .put<IModuleAPIResponse[]>(`/sandboxes/${sandboxId}/modules/mupdate`, {
        modules,
      })
      .then(modulesResult => modulesResult.map(transformModule));
  },
  getGitChanges(sandboxId: string): Promise<GitPathChanges> {
    return api.get(`/sandboxes/${sandboxId}/git/diff`);
  },
  saveGitOriginalCommitSha(
    sandboxId: string,
    commitSha: string
  ): Promise<void> {
    return api.patch(`/sandboxes/${sandboxId}/original_git_commit_sha`, {
      original_git_commit_sha: commitSha,
    });
  },
  saveTemplate(sandboxId: string, template: TemplateType): Promise<void> {
    return api.put(`/sandboxes/${sandboxId}/`, {
      sandbox: { template },
    });
  },
  unlikeSandbox(sandboxId: string) {
    return api.request({
      method: 'DELETE',
      url: `/sandboxes/${sandboxId}/likes`,
      data: {
        id: sandboxId,
      },
    });
  },
  likeSandbox(sandboxId: string) {
    return api.post(`/sandboxes/${sandboxId}/likes`, {
      id: sandboxId,
    });
  },
  savePrivacy(sandboxId: string, privacy: 0 | 1 | 2) {
    return api.patch<SandboxAPIResponse>(`/sandboxes/${sandboxId}/privacy`, {
      sandbox: {
        privacy,
      },
    });
  },
  saveFrozen(sandboxId: string, isFrozen: boolean) {
    return api.put<SandboxAPIResponse>(`/sandboxes/${sandboxId}`, {
      sandbox: {
        is_frozen: isFrozen,
      },
    });
  },
  getEnvironmentVariables(
    sandboxId: string
  ): Promise<{ [key: string]: string }> {
    return api.get(
      `/sandboxes/${sandboxId}/env`,
      {},
      { shouldCamelize: false }
    );
  },
  saveEnvironmentVariable(
    sandboxId: string,
    environmentVariable: EnvironmentVariable
  ): Promise<{ [key: string]: string }> {
    return api.post(
      `/sandboxes/${sandboxId}/env`,
      {
        environment_variable: environmentVariable,
      },
      {
        shouldCamelize: false,
      }
    );
  },
  deleteEnvironmentVariable(
    sandboxId: string,
    name: string
  ): Promise<{ [key: string]: string }> {
    return api.delete(
      `/sandboxes/${sandboxId}/env/${name}`,
      {},
      { shouldCamelize: false }
    );
  },
  saveModuleTitle(sandboxId: string, moduleShortid: string, title: string) {
    return api.put<IModuleAPIResponse>(
      `/sandboxes/${sandboxId}/modules/${moduleShortid}`,
      {
        module: { title },
      }
    );
  },
  getPopularSandboxes(date: string): Promise<PopularSandboxes> {
    return api.get(`/sandboxes/popular?start_date=${date}`);
  },
  saveSandboxPick(
    sandboxId: string,
    title: string,
    description: string
  ): Promise<SandboxPick> {
    return api.post(`/sandboxes/${sandboxId}/pick`, {
      title,
      description,
    });
  },
  getPickedSandboxes(): Promise<PickedSandboxes> {
    return api.get(`/sandboxes/picked`);
  },
  createDirectory(
    sandboxId: string,
    directoryShortid: string,
    title: string
  ): Promise<Directory> {
    return api
      .post<IDirectoryAPIResponse>(`/sandboxes/${sandboxId}/directories`, {
        directory: {
          title,
          directoryShortid,
        },
      })
      .then(transformDirectory);
  },
  saveModuleDirectory(
    sandboxId: string,
    moduleShortid: string,
    directoryShortid: string
  ) {
    return api.put<IDirectoryAPIResponse>(
      `/sandboxes/${sandboxId}/modules/${moduleShortid}`,
      {
        module: { directoryShortid },
      }
    );
  },
  saveDirectoryDirectory(
    sandboxId: string,
    sourceDirectoryShortid: string,
    targetDirectoryShortId: string
  ) {
    return api.put<IDirectoryAPIResponse>(
      `/sandboxes/${sandboxId}/directories/${sourceDirectoryShortid}`,
      {
        directory: { directoryShortid: targetDirectoryShortId },
      }
    );
  },
  deleteDirectory(sandboxId: string, directoryShortid: string) {
    return api.delete(
      `/sandboxes/${sandboxId}/directories/${directoryShortid}`
    );
  },
  saveDirectoryTitle(
    sandboxId: string,
    directoryShortid: string,
    title: string
  ) {
    return api.put<IDirectoryAPIResponse>(
      `/sandboxes/${sandboxId}/directories/${directoryShortid}`,
      {
        directory: { title },
      }
    );
  },
  getUploads(): Promise<UploadedFilesInfo> {
    return api.get('/users/current_user/uploads');
  },
  deleteUploadedFile(uploadId: string): Promise<void> {
    return api.delete(`/users/current_user/uploads/${uploadId}`);
  },
  createUpload(name: string, content: string): Promise<{ url: string }> {
    return api.post('/users/current_user/uploads', {
      content,
      name,
    });
  },
  async massCreateModules(
    sandboxId: string,
    directoryShortid: string | null,
    modules: Module[],
    directories: Directory[]
  ): Promise<{
    modules: Module[];
    directories: Directory[];
  }> {
    const data = (await api.post(`/sandboxes/${sandboxId}/modules/mcreate`, {
      directoryShortid,
      modules,
      directories,
    })) as {
      modules: IModuleAPIResponse[];
      directories: IDirectoryAPIResponse[];
    };

    return {
      modules: data.modules.map(transformModule),
      directories: data.directories.map(transformDirectory),
    };
  },
  createGit(
    sandboxId: string,
    repoTitle: string,
    data: object
  ): Promise<GitInfo> {
    return api.post(`/sandboxes/${sandboxId}/git/repo/${repoTitle}`, data);
  },
  createGitCommit(
    sandboxId: string,
    message: string,
    changes: GitChanges,
    parentCommitShas: string[]
  ): Promise<GitCommit> {
    return api.post(`/sandboxes/${sandboxId}/git/commit`, {
      id: sandboxId,
      message,
      changes,
      parentCommitShas,
    });
  },
  async compareGit(
    sandboxId: string,
    baseRef: string,
    headRef: string,
    includeContents = false
  ): Promise<{
    baseCommitSha: string;
    headCommitSha: string;
    files: GitFileCompare[];
  }> {
    const response: any = await api.post(
      `/sandboxes/${sandboxId}/git/compare`,
      {
        baseRef,
        headRef,
        includeContents,
      }
    );

    return response;
  },
  getGitPr(sandboxId: string, prNumber: number): Promise<GitPr> {
    return api.get(`/sandboxes/${sandboxId}/git/prs/${prNumber}`);
  },
  async getGitRights(sandboxId: string) {
    const response = await api.get<{ permission: 'admin' | 'write' | 'read' }>(
      `/sandboxes/${sandboxId}/git/rights`
    );

    return response.permission;
  },
  createGitPr(
    sandboxId: string,
    title: string,
    description: string,
    changes: GitChanges
  ): Promise<GitPr> {
    return api.post(`/sandboxes/${sandboxId}/git/pr`, {
      sandboxId,
      title,
      description,
      changes,
    });
  },
  async createLiveRoom(sandboxId: string): Promise<string> {
    const data = await api.post<{
      id: string;
    }>(`/sandboxes/${sandboxId}/live`, {
      id: sandboxId,
    });

    return data.id;
  },
  updateBadge(badgeId: string, visible: boolean): Promise<void> {
    return api.patch(`/users/current_user/badges/${badgeId}`, {
      badge: {
        visible,
      },
    });
  },
  getPaymentDetails(): Promise<PaymentDetails> {
    return api.get(`/users/current_user/payment_details`);
  },
  updatePaymentDetails(token: string): Promise<PaymentDetails> {
    return api.patch('/users/current_user/payment_details', {
      paymentDetails: {
        token,
      },
    });
  },
  getProfile(username: string): Promise<Profile> {
    return api.get(`/users/${username}`);
  },
  getUserSandboxes(
    username: string,
    page: number | 'all' = 1,
    sortBy: string = 'view_count',
    direction: string = 'desc'
  ): Promise<{ [page: string]: Sandbox[] }> {
    return api.get(
      `/users/${username}/sandboxes?sort_by=${sortBy}&direction=${direction}`,
      {
        page: String(page),
      }
    );
  },
  getUserLikedSandboxes(
    username: string,
    page: number
  ): Promise<{ [page: string]: Sandbox[] }> {
    return api.get(`/users/${username}/sandboxes/liked`, {
      page: String(page),
    });
  },
  getSandboxes(): Promise<UserSandbox[]> {
    return api.get('/sandboxes');
  },
  getPendingUser(id: string): Promise<PendingUserType> {
    return api.get('/users/pending/' + id);
  },
  validateUsername(username: string): Promise<{ available: boolean }> {
    return api.get('/users/available/' + username);
  },
  finalizeSignUp({
    username,
    id,
    name,
  }: {
    username: string;
    id: string;
    name: string;
  }): Promise<void> {
    return api.post('/users/finalize', {
      username,
      id,
      name,
    });
  },
  updateShowcasedSandbox(username: string, sandboxId: string) {
    return api.patch(`/users/${username}`, {
      user: {
        showcasedSandboxShortid: sandboxId,
      },
    });
  },
  deleteSandbox(sandboxId: string): Promise<void> {
    return api.request({
      method: 'DELETE',
      url: `/sandboxes/${sandboxId}`,
      data: {
        id: sandboxId,
      },
    });
  },
  createTag(sandboxId: string, tagName: string): Promise<string[]> {
    return api.post(`/sandboxes/${sandboxId}/tags`, {
      tag: tagName,
    });
  },
  deleteTag(sandboxId: string, tagName: string): Promise<string[]> {
    return api.delete(`/sandboxes/${sandboxId}/tags/${tagName}`);
  },
  updateSandbox(sandboxId: string, data: Partial<Sandbox>): Promise<Sandbox> {
    return api.put(`/sandboxes/${sandboxId}`, {
      sandbox: data,
    });
  },
  createResource(sandboxId: string, resource: string): Promise<void> {
    return api.post(`/sandboxes/${sandboxId}/resources`, {
      externalResource: resource,
    });
  },
  deleteResource(sandboxId: string, resource: string): Promise<void> {
    return api.request({
      method: 'DELETE',
      url: `/sandboxes/${sandboxId}/resources/`,
      data: {
        id: resource,
      },
    });
  },
  updatePrivacy(
    sandboxId: string,
    privacy: 0 | 1 | 2
  ): Promise<SandboxAPIResponse> {
    return api.patch(`/sandboxes/${sandboxId}/privacy`, {
      sandbox: {
        privacy,
      },
    });
  },
  updateTeamAvatar(
    name: string,
    avatar: string,
    teamId: string
  ): Promise<AvatarAPIResponse> {
    return api.post(`/teams/${teamId}/avatar`, {
      name,
      avatar,
    });
  },
  createVercelIntegration(code: string): Promise<CurrentUser> {
    return api.post(`/users/current_user/integrations/zeit`, {
      code,
    });
  },
  signout(): Promise<void> {
    return api.delete(`/users/signout`);
  },
  signoutGithubIntegration(): Promise<void> {
    return api.delete(`/users/current_user/integrations/github`);
  },
  signoutVercel(): Promise<void> {
    return api.delete(`/users/current_user/integrations/zeit`);
  },
  preloadTemplates() {
    client.query({ query: LIST_PERSONAL_TEMPLATES, variables: {} });
  },
  deleteTemplate(
    sandboxId: string,
    templateId: string
  ): Promise<CustomTemplate> {
    return api.delete(`/sandboxes/${sandboxId}/templates/${templateId}`);
  },
  updateTemplate(
    sandboxId: string,
    template: CustomTemplate
  ): Promise<CustomTemplate> {
    return api
      .put<{ template: CustomTemplate }>(
        `/sandboxes/${sandboxId}/templates/${template.id}`,
        {
          template,
        }
      )
      .then(data => data.template);
  },
  createTemplate(
    sandboxId: string,
    template: { color: string; description: string; title: string }
  ): Promise<CustomTemplate> {
    return api
      .post<{ template: CustomTemplate }>(`/sandboxes/${sandboxId}/templates`, {
        template,
      })
      .then(data => data.template);
  },
  updateExperiments(experiments: { [key: string]: boolean }): Promise<void> {
    return api.post(`/users/experiments`, {
      experiments,
    });
  },
  queryUsers(query: string): Promise<UserQuery[]> {
    return api.get(`/users/search?username=${query}`);
  },
  makeGitSandbox(sandboxId: string): Promise<Sandbox> {
    return api.post<Sandbox>(`/sandboxes/${sandboxId}/make_git_sandbox`, null);
  },
  updateUserFeaturedSandboxes(
    username: string,
    featuredSandboxIds: string[]
  ): Promise<Profile> {
    return api.patch(`/users/${username}`, {
      user: {
        featuredSandboxes: featuredSandboxIds,
      },
    });
  },
  createUserSettings({
    name,
    settings,
  }: {
    name: string;
    settings: string;
  }): Promise<SettingsSync> {
    return api.post(`/users/current_user/editor_settings`, {
      name,
      settings,
    });
  },
  getUserSettings(): Promise<SettingsSync[]> {
    return api.get(`/users/current_user/editor_settings`);
  },
  editUserSettings(body: any, id: string): Promise<SettingsSync> {
    return api.patch(`/users/current_user/editor_settings/${id}`, body);
  },
  removeUserSetting(id: string): Promise<SettingsSync> {
    return api.delete(`/users/current_user/editor_settings`);
  },
};

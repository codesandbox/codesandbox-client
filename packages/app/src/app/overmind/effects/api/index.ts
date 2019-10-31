import { TemplateType } from '@codesandbox/common/lib/templates';
import {
  CurrentUser,
  CustomTemplate,
  Dependency,
  Directory,
  EnvironmentVariable,
  GitChanges,
  GitCommit,
  GitInfo,
  GitPr,
  Module,
  PaymentDetails,
  PickedSandboxes,
  PopularSandboxes,
  Profile,
  Sandbox,
  SandboxPick,
  UploadedFilesInfo,
  UserSandbox,
} from '@codesandbox/common/lib/types';
import { client } from 'app/graphql/client';
import { LIST_TEMPLATES } from 'app/pages/Dashboard/queries';

import {
  transformDirectory,
  transformModule,
  transformSandbox,
} from '../utils/sandbox';
import apiFactory, { Api, ApiConfig } from './apiFactory';
import {
  IDirectoryAPIResponse,
  IModuleAPIResponse,
  SandboxAPIResponse,
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
  createPatronSubscription(token: string, amount: number, coupon: string) {
    return api.post<CurrentUser>('/users/current_user/subscription', {
      subscription: {
        amount,
        coupon,
        token,
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
  getDependency(name: string): Promise<Dependency> {
    return api.get(`/dependencies/${name}@latest`);
  },
  async getSandbox(id: string): Promise<Sandbox> {
    const sandbox = await api.get<SandboxAPIResponse>(`/sandboxes/${id}`);

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
  saveModuleCode(sandboxId: string, module: Module): Promise<Module> {
    return api
      .put<IModuleAPIResponse>(
        `/sandboxes/${sandboxId}/modules/${module.shortid}`,
        {
          module: { code: module.code },
        }
      )
      .then(transformModule);
  },
  saveModules(sandboxId: string, modules: Module[]) {
    return api.put(`/sandboxes/${sandboxId}/modules/mupdate`, {
      modules,
    });
  },
  getGitChanges(sandboxId: string): Promise<GitChanges> {
    return api.get(`/sandboxes/${sandboxId}/git/diff`);
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
  createGitCommit(sandboxId: string, message: string): Promise<GitCommit> {
    return api.post(`/sandboxes/${sandboxId}/git/commit`, {
      id: sandboxId,
      message,
    });
  },
  createGitPr(sandboxId: string, message: string): Promise<GitPr> {
    return api.post(`/sandboxes/${sandboxId}/git/pr`, {
      id: sandboxId,
      message,
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
    page: number
  ): Promise<{ [page: string]: Sandbox[] }> {
    return api.get(`/users/${username}/sandboxes`, {
      page: String(page),
    });
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
  createZeitIntegration(code: string): Promise<CurrentUser> {
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
  preloadTemplates() {
    client.query({ query: LIST_TEMPLATES, variables: { showAll: true } });
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
};

import apiFactory, { Api, ApiConfig } from './apiFactory';
import {
  CurrentUser,
  Dependency,
  Sandbox,
  Module,
  GitChanges,
  EnvironmentVariable,
  PopularSandboxes,
  SandboxPick,
  PickedSandboxes,
  UploadedFilesInfo,
  Directory,
  GitInfo,
  GitCommit,
  GitPr,
} from '@codesandbox/common/lib/types';
import { TemplateType } from '@codesandbox/common/lib/templates';

let api: Api;

export default {
  initialize(config: ApiConfig) {
    api = apiFactory(config);
  },
  createPatronSubscription(token: string, amount: string) {
    return api.post<CurrentUser>('/users/current_user/subscription', {
      subscription: {
        amount,
        token,
      },
    });
  },
  updatePatronSubscription(amount: string) {
    return api.patch<CurrentUser>('/users/current_user/subscription', {
      subscription: {
        amount,
      },
    });
  },
  cancelPatronSubscription() {
    return api.delete<CurrentUser>('/users/current_user/subscription');
  },
  getDependency(name: string): Promise<Dependency> {
    return api.get(`/dependencies/${name}@latest`);
  },
  getSandbox(id: string): Promise<Sandbox> {
    return api.get(`/sandboxes/${id}`);
  },
  forkSandbox(id: string): Promise<Sandbox> {
    const url = id.includes('/')
      ? `/sandboxes/fork/${id}`
      : `/sandboxes/${id}/fork`;

    return api.post(url, {});
  },
  createModule(sandboxId: string, module: Module): Promise<Module> {
    return api.post(`/sandboxes/${sandboxId}/modules`, {
      module: {
        title: module.title,
        directoryShortid: module.directoryShortid,
        code: module.code,
        isBinary: module.isBinary === undefined ? false : module.isBinary,
      },
    });
  },
  deleteModule(sandboxId: string, moduleShortid: string): Promise<void> {
    return api.delete(`/sandboxes/${sandboxId}/modules/${moduleShortid}`);
  },
  saveModuleCode(sandboxId: string, module: Module): Promise<Module> {
    return api.put(`/sandboxes/${sandboxId}/modules/${module.shortid}`, {
      module: { code: module.code },
    });
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
    return api.patch(`/sandboxes/${sandboxId}/privacy`, {
      sandbox: {
        privacy: privacy,
      },
    });
  },
  saveFrozen(sandboxId: string, isFrozen: boolean) {
    return api.put(`/sandboxes/${sandboxId}`, {
      sandbox: {
        is_frozen: isFrozen,
      },
    });
  },
  getEnvironmentVariables(sandboxId: string): Promise<EnvironmentVariable[]> {
    return api.get(
      `/sandboxes/${sandboxId}/env`,
      {},
      { shouldCamelize: false }
    );
  },
  saveEnvironmentVariable(
    sandboxId: string,
    environmentVariable: EnvironmentVariable
  ): Promise<EnvironmentVariable[]> {
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
  ): Promise<EnvironmentVariable[]> {
    return api.delete(
      `/sandboxes/${sandboxId}/env/${name}`,
      {},
      { shouldCamelize: false }
    );
  },
  saveModuleTitle(sandboxId: string, moduleShortid: string, title: string) {
    return api.put(`/sandboxes/${sandboxId}/modules/${moduleShortid}`, {
      module: { title },
    });
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
  createDirectory(sandboxId: string, title: string): Promise<Directory> {
    return api.post(`/sandboxes/${sandboxId}/directories`, {
      directory: {
        title: title,
      },
    });
  },
  saveModuleDirectory(
    sandboxId: string,
    moduleShortid: string,
    directoryShortid: string
  ) {
    return api.put(`/sandboxes/${sandboxId}/modules/${moduleShortid}`, {
      module: { directoryShortid },
    });
  },
  saveDirectoryDirectory(
    sandboxId: string,
    sourceDirectoryShortid: string,
    targetDirectoryShortId: string
  ) {
    return api.put(
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
    return api.put(`/sandboxes/${sandboxId}/directories/${directoryShortid}`, {
      directory: { title },
    });
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
  massCreateModules(
    sandboxId: string,
    directoryShortid: string,
    modules: Module[],
    directories: Directory[]
  ): Promise<{
    modules: Module[];
    directories: Directory[];
  }> {
    return api.post(`/sandboxes/${sandboxId}/modules/mcreate`, {
      directoryShortid,
      modules,
      directories,
    });
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
};

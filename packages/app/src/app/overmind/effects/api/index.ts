import apiFactory, { Api, ApiConfig } from './apiFactory';
import {
  CurrentUser,
  Dependency,
  Sandbox,
  Module,
  GitChanges,
  EnvironmentVariable,
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
  createModule(id: string, module: Module): Promise<Module> {
    return api.post(`/sandboxes/${id}/modules`, {
      module: {
        title: module.title,
        directoryShortid: module.directoryShortid,
        code: module.code,
        isBinary: module.isBinary === undefined ? false : module.isBinary,
      },
    });
  },
  saveModuleCode(id: string, module: Module): Promise<Module> {
    return api.put(`/sandboxes/${id}/modules/${module.shortid}`, {
      module: { code: module.code },
    });
  },
  saveModules(id: string, modules: Module[]) {
    return api.put(`/sandboxes/${id}/modules/mupdate`, {
      modules,
    });
  },
  getGitChanges(id: string): Promise<GitChanges> {
    return api.get(`/sandboxes/${id}/git/diff`);
  },
  saveTemplate(id: string, template: TemplateType): Promise<void> {
    return api.put(`/sandboxes/${id}/`, {
      sandbox: { template },
    });
  },
  unlikeSandbox(id: string) {
    return api.request({
      method: 'DELETE',
      url: `/sandboxes/${id}/likes`,
      data: {
        id: id,
      },
    });
  },
  likeSandbox(id: string) {
    return api.post(`/sandboxes/${id}/likes`, {
      id,
    });
  },
  savePrivacy(id: string, privacy: 0 | 1 | 2) {
    return api.patch(`/sandboxes/${id}/privacy`, {
      sandbox: {
        privacy: privacy,
      },
    });
  },
  saveFrozen(id: string, isFrozen: boolean) {
    return api.put(`/sandboxes/${id}`, {
      sandbox: {
        is_frozen: isFrozen,
      },
    });
  },
  getEnvironmentVariables(id: string): Promise<EnvironmentVariable[]> {
    return api.get(`/sandboxes/${id}/env`, {}, { shouldCamelize: false });
  },
  saveEnvironmentVariable(
    id: string,
    environmentVariable: EnvironmentVariable
  ): Promise<EnvironmentVariable[]> {
    return api.post(
      `/sandboxes/${id}/env`,
      {
        environment_variable: environmentVariable,
      },
      {
        shouldCamelize: false,
      }
    );
  },
  deleteEnvironmentVariable(
    id: string,
    name: string
  ): Promise<EnvironmentVariable[]> {
    return api.delete(
      `/sandboxes/${id}/env/${name}`,
      {},
      { shouldCamelize: false }
    );
  },
  saveModuleTitle(id: string, moduleShortid: string, title: string) {
    return api.put(`/sandboxes/${id}/modules/${moduleShortid}`, {
      module: { title },
    });
  },
};

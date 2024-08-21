import {
  CurrentUserFromAPI,
  CustomTemplate,
  Profile,
  Sandbox,
  UploadedFilesInfo,
  UserQuery,
  UserSandbox,
  ForkSandboxBody,
} from '@codesandbox/common/lib/types';
import { FETCH_TEAM_TEMPLATES } from 'app/components/Create/utils/queries';
import { client } from 'app/graphql/client';
import { PendingUserType } from 'app/overmind/state';

import { transformSandbox } from '../utils/sandbox';
import apiFactory, { Api, ApiConfig, Params } from './apiFactory';
import {
  SandboxAPIResponse,
  FinalizeSignUpOptions,
  MetaFeatures,
  VMTier,
  APIPricingResult,
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
  async getSandpackTokenFromTeam(teamId: string): Promise<string> {
    const response = await api.post<{ token: string }>(
      `/sandpack/token/${teamId}`,
      {}
    );

    return response.token;
  },
  getCurrentUser(): Promise<CurrentUserFromAPI> {
    return api.get('/users/current');
  },
  getSandboxTitle(): Promise<{ title: string }> {
    return api.get('/sandboxes/generate_title');
  },
  markSurveySeen(): Promise<void> {
    return api.post('/users/survey-seen', {});
  },
  revokeToken(token: string): Promise<void> {
    return api.delete(`/auth/revoke/${token}`);
  },
  async getSandbox(id: string, params?: Params): Promise<Sandbox> {
    const sandbox = await api.get<SandboxAPIResponse>(
      `/sandboxes/${id}`,
      params
    );

    // We need to add client side properties for tracking
    return transformSandbox(sandbox);
  },
  async forkSandbox(id: string, body?: ForkSandboxBody): Promise<Sandbox> {
    const url = id.includes('/')
      ? `/sandboxes/fork/${id}`
      : `/sandboxes/${id}/fork`;

    const sandbox = await api.post<SandboxAPIResponse>(url, body || {});

    return transformSandbox(sandbox);
  },
  getUploads(): Promise<UploadedFilesInfo> {
    return api.get('/users/current_user/uploads');
  },
  deleteUploadedFile(uploadId: string): Promise<void> {
    return api.delete(`/users/current_user/uploads/${uploadId}`);
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
  finalizeSignUp(
    options: FinalizeSignUpOptions
  ): Promise<{ primaryTeamId: string }> {
    return api.post('/users/finalize', options);
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
  /**
   * Updates a sandbox. Used to update sandbox metadata but also to convert
   * a sandbox to a devbox.
   */
  updateSandbox(sandboxId: string, data: Partial<Sandbox>): Promise<Sandbox> {
    return api.put(`/sandboxes/${sandboxId}`, {
      sandbox: data,
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
  signout(): Promise<void> {
    return api.delete(`/users/signout`);
  },
  signoutGithubIntegration(): Promise<void> {
    return api.delete(`/users/current_user/integrations/github`);
  },
  preloadTeamTemplates(teamId: string) {
    client.query({ query: FETCH_TEAM_TEMPLATES, variables: { teamId } });
  },
  deleteTemplate(
    sandboxId: string,
    templateId: string
  ): Promise<CustomTemplate> {
    return api.delete(`/sandboxes/${sandboxId}/templates/${templateId}`);
  },
  queryUsers(query: string): Promise<UserQuery[]> {
    return api.get(`/users/search?username=${query}`);
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
  sandboxesLimits() {
    return api.get<{
      sandboxCount: number;
      sandboxLimit: number;
    }>(`/sandboxes/limits`);
  },
  getPrices(version?: string) {
    return api.get<APIPricingResult>(`/prices`, undefined, {
      version: version || '2023-08-15',
      shouldCamelize: false, // ensure addon keys don't get messed up
    });
  },
  stripeCreateCheckout({
    success_path,
    cancel_path,
    team_id,
    recurring_interval,
  }: {
    success_path: string;
    cancel_path: string;
    team_id: string;
    recurring_interval: string;
  }) {
    return api.post<{ stripeCheckoutUrl: string }>(`/checkout`, {
      success_path,
      cancel_path,
      team_id,
      recurring_interval,
    });
  },
  stripeCreateUBBCheckout(params: {
    success_path: string;
    cancel_path: string;
    team_id: string;
    plan: string;
    billing_interval: string;
    addons: string[];
  }) {
    return api.post<{ stripeCheckoutUrl: string }>(`/checkout`, params, {
      version: '2024-01-20',
    });
  },
  stripeCustomerPortal(teamId: string, return_path: string) {
    return api.get<{ stripeCustomerPortalUrl: string }>(
      `/teams/${teamId}/customer_portal?return_path=${return_path}`
    );
  },
  removeBranchFromRepository(
    workspaceId: string,
    owner: string,
    repo: string,
    branch: string
  ) {
    return api.delete(`/beta/sandboxes/github/${owner}/${repo}/${branch}`, {
      workspace_id: workspaceId,
    });
  },
  removeLinkedProjectFromTeam(owner: string, repo: string, teamId: string) {
    return api.delete(`/beta/repos/link/github/${owner}/${repo}/${teamId}`);
  },
  forkRepository(
    source: { owner: string; name: string },
    destination: {
      name: string;
      teamId: string;
      organization?: string;
    }
  ) {
    let body: Record<string, string | boolean> = {
      name: destination.name,
      team_id: destination.teamId,
    };
    if (destination.organization) {
      body = { ...body, organization: destination.organization };
    }

    return api.post<{ owner: string; repo: string; branch: string }>(
      `/beta/fork/github/${source.owner}/${source.name}`,
      body
    );
  },
  initializeSSO(email: string) {
    return api.get<{ redirectUrl: string }>('/auth/workos/initialize', {
      email,
    });
  },
  getFeatures(): Promise<MetaFeatures> {
    // version null ensures no /v1 is in the URL
    return api.get('/meta/features', undefined, { version: null });
  },
  getVMSpecs(): Promise<{ vmTiers: VMTier[] }> {
    // version null ensures no /v1 is in the URL
    return api.get('/vm_tiers', undefined, { version: null });
  },
  setVMSpecs(sandboxId: string, vmTier: number) {
    return api.patch(`/sandboxes/${sandboxId}/vm_tier`, {
      vmTier,
    });
  },
};

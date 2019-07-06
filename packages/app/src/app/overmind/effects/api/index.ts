import apiFactory, { Api, ApiConfig } from './apiFactory';
import { CurrentUser } from '@codesandbox/common/lib/types';

export default (() => {
  let api: Api;

  return {
    initialize(config: ApiConfig) {
      api = apiFactory(config);
    },
    createPatronSubscription(token: string, amount: number) {
      return api.post<CurrentUser>('/users/current_user/subscription', {
        subscription: {
          amount,
          token,
        },
      });
    },
    updatePatronSubscription(amount: number) {
      return api.patch<CurrentUser>('/users/current_user/subscription', {
        subscription: {
          amount,
        },
      });
    },
    cancelPatronSubscription() {
      return api.delete<CurrentUser>('/users/current_user/subscription');
    },
  };
})();

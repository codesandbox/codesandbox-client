export const ALGOLIA_API_KEY = '85194a1433e4196466a0f80135439c79';
export const ALGOLIA_APPLICATION_ID = '5O7BRBEIVD';
export const ALGOLIA_DEFAULT_INDEX =
  process.env.NODE_ENV === 'production' || process.env.LOCAL_SERVER
    ? 'prod_sandboxes'
    : 'dev_sandboxes';

export const STRIPE_API_KEY =
  process.env.NODE_ENV === 'production'
    ? 'pk_live_KeUgofl1VrjTtbrhhN7gGI9W'
    : 'pk_test_0HgnQIkQJCECIFCQkafGQ5gA';

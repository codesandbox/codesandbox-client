export const ALGOLIA_API_KEY = '7675b9e87ed7dd5bbf18f3e5310f92d6';
export const ALGOLIA_APPLICATION_ID = 'ZACZHDBO7S';
export const ALGOLIA_DEFAULT_INDEX =
  process.env.NODE_ENV === 'production' ? 'prod_sandboxes' : 'dev_sandboxes';

export const STRIPE_API_KEY =
  process.env.NODE_ENV === 'production'
    ? 'pk_live_KeUgofl1VrjTtbrhhN7gGI9W'
    : 'pk_test_0HgnQIkQJCECIFCQkafGQ5gA';

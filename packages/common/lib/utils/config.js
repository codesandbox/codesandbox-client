'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ALGOLIA_API_KEY = '7675b9e87ed7dd5bbf18f3e5310f92d6';
exports.ALGOLIA_APPLICATION_ID = 'ZACZHDBO7S';
exports.ALGOLIA_DEFAULT_INDEX =
  process.env.NODE_ENV === 'production' || process.env.LOCAL_SERVER
    ? 'prod_sandboxes'
    : 'dev_sandboxes';
exports.STRIPE_API_KEY =
  process.env.NODE_ENV === 'production'
    ? 'pk_live_KeUgofl1VrjTtbrhhN7gGI9W'
    : 'pk_test_0HgnQIkQJCECIFCQkafGQ5gA';

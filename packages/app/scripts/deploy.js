const fetch = require('cross-fetch');

fetch(
  `https://backstage.csbops.io/api/deploy/gitops/codesandbox/codesandbox-gitops/codesandbox-core/codesandbox/${process.env.ENVIRONMENT}/helm-chart-values/values.yaml`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CF-Access-Client-Id': process.env.CF_ZERO_TRUST_BACKSTAGE_DEPLOY_ID,
      'CF-Access-Client-Secret':
        process.env.CF_ZERO_TRUST_BACKSTAGE_DEPLOY_TOKEN,
    },
    body: JSON.stringify({
      key: 'client.image.tag',
      commitMessage: `Client V1: deploy to ${
        process.env.ENVIRONMENT
      } with ${process.env.CIRCLE_SHA1.substr(0, 7)}`,
      value: process.env.CIRCLE_SHA1.substr(0, 7),
    }),
  }
)
  .then(x => {
    if (!x.ok) {
      return x.json().then(resss => {
        console.error(resss);
        throw new Error('Request failed');
      });
    }

    return x.json();
  })
  .then(res => {
    // eslint-disable-next-line
    console.log(res);
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });

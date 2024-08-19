const fetch = require('cross-fetch');

fetch(
  `https://deployer.csbops.io/apps/codesandbox-editor-v1`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CF-Access-Client-Id': process.env.CF_ZERO_TRUST_DEPLOYER_CLIENT_ID,
      'CF-Access-Client-Secret':
        process.env.CF_ZERO_TRUST_DEPLOYER_CLIENT_SECRET,
      'Authorization': `Bearer ${process.env.DEPLOYER_API_TOKEN}`
    },
    body: JSON.stringify({
      environment: process.env.ENVIRONMENT,
      tag: process.env.CIRCLE_SHA1.substr(0, 7),
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

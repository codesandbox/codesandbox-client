const fetch = require('cross-fetch');

fetch('https://deploy-api.ops.csb.dev/image', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.DEPLOY_TOKEN}`,
  },
  body: JSON.stringify({
    env: process.env.ENVIRONMENT,
    image: 'client',
    tag: process.env.CIRCLE_SHA1.substr(0, 7),
    deploy: true,
  }),
})
  .then(x => {
    if (!x.ok) {
      return x.json().then(res => {
        console.error(res);
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

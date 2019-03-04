const Airtable = require('airtable');

const base = new Airtable({ apiKey: process.env.AIRTABLE }).base(
  'app2gXNW9K8G72HlD'
);

export default async ({ username, id }) =>
  new Promise((resolve, reject) => {
    base('accounts').create(
      {
        username,
        id,
      },
      err => {
        if (err) {
          console.error(err);
          reject();
        }
        resolve();
      }
    );
  });

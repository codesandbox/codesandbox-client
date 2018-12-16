import Airtable from 'airtable';

const base = new Airtable({ apiKey: 'keyJugfwdJzOyL7Aa' }).base(
  'appzdQFPct2p9gFZi'
);

export default ({ feedback, emoji, sandboxId, username, email }) =>
  new Promise((resolve, reject) => {
    base('feedback').create(
      {
        feedback,
        emoji,
        sandboxId,
        username,
        email,
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

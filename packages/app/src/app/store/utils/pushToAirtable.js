export default async ({ feedback, emoji, sandboxId, username, email }) => {
  const Airtable = await import(
    /* webpackChunkName: 'airtable' */ './setAirtable'
  );
  const base = Airtable.default.base('appzdQFPct2p9gFZi');

  return new Promise((resolve, reject) => {
    base('feedback').create(
      {
        feedback,
        emoji,
        sandboxId,
        username,
        email,
        url: window.location.pathname,
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
};

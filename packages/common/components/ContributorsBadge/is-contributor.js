let contributors;
let fetchPromise;

export async function isContributor(username: string) {
  if (!contributors) {
    await (fetchPromise ||
      (fetchPromise = window
        .fetch(
          'https://raw.githubusercontent.com/CompuIves/codesandbox-client/master/.all-contributorsrc'
        )
        .then(x => x.json())
        .then(x => x.contributors.map(u => u.login))
        .then(names => {
          contributors = names;
        })
        .catch(() => {})));
  }

  return contributors && contributors.indexOf(username) > -1;
}

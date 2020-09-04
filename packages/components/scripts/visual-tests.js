const execa = require('execa');
const git = require('simple-git')();

const hasChanges = async () => {
  const { files } = await git.diffSummary(['master...HEAD']);

  return files.length > 0;
};

const run = autoAccept => {
  const options = ['chromatic:base'];
  if (autoAccept) {
    options.push('--auto-accept-changes');
  }

  execa('yarn', options).stdout.pipe(process.stdout);
};

const start = async () => {
  const { current: currentBranch } = await git.branch();

  if (currentBranch === 'master') {
    return run(true);
  }

  if (await hasChanges()) {
    return run();
  }

  console.warn('No changes found in branch, skipping visual tests');
};

start();

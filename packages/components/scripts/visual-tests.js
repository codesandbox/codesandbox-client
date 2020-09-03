const execa = require('execa');
const git = require('simple-git')();

const hasChanges = async () => {
  const result = await git.diffSummary(['master...HEAD']);
  if (result.files.length) return true;
  return false;
};

const run = autoAccept => {
  const options = ['chromatic:base'];
  if (autoAccept) options.push('--auto-accept-changes');

  execa('yarn', options).stdout.pipe(process.stdout);
};

const start = async () => {
  const { current: currentBranch } = await git.branch();

  if (currentBranch === 'master') {
    run(true);
  } else {
    const changes = await hasChanges();
    if (changes) run();
    else console.warn('No changes found in branch, skipping visual tests');
  }
};

start();

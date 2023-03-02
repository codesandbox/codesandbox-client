---
banner: ./images/banner.jpg
slug: better-github-workflow
authors: ["Ives van Hoorne"]
photo: https://avatars0.githubusercontent.com/u/587016?s=460&v=4
title: A Better GitHub Workflow
description:
  We've made it even easier for you to work with GitHub projects on CodeSandbox.
date: 2020-07-07
---

We've made it even easier for you to work with GitHub projects on CodeSandbox.
While you've been able to import and export projects to and from GitHub for a while, 
the workflow was confusing. This update focuses on making that
workflow more user-friendly. We've tackled five areas: refining the core flow,
improving the UI, adding new functionality to keep sandboxes in sync, as
well as adding new, quicker ways to import projects, and a better way to work
with repos in the long-term. Let's dig into the changes.

### Core flow changes

When you import a project from GitHub, the resulting sandbox stays up to date
with the repo on GitHub, and you can fork it to make changes on CodeSandbox.
Now, once you've made changes, you can either commit them directly to master or
create a new branch and start a PR while staying in the same sandbox.

### UI changes

We've made the UI clearer with indicators and instructions on the status of your
project and the next steps you need to take. Sandboxes from GitHub are now more
easily distinguishable from regular sandboxes: there are different action bar
menu items, and a GitHub info section replaces the regular sandbox info panel.
This provides a link to the original repo along with instructions on making
changes to it. There's also an indication of the branch and repo it came from in
the top menu bar.

### Stay in sync and fix merge conflicts

We've added essential new functionality that enables you to keep a sandbox in
sync with a repo and resolve conflicts if they occur. You no longer need to keep
forking the imported sandbox to work with changes made to the repo outside of
CodeSandbox. You can see when a change you make causes merge conflicts, and they
can be resolved in the sandbox. This means you can more easily use CodeSandbox
alongside your local development setup, or other tools, to contribute code to a
repo.

### Importing projects from GitHub to CodeSandbox

There are also some new ways to import projects from GitHub to CodeSandbox. You
can replace 'github.com' with 'githubbox.com' in a URL to a repo, and we'll
import it. Thanks to CodeSandbox community user
[Dominik Ferber](https://github.com/dferber90/githubbox) for putting this
together using our import functionality. We've sponsored the project so you can
rely on it being around for the long-term. You can also use our browser
extensions for
[Chrome](https://chrome.google.com/webstore/detail/open-in-codesandbox/hdidglkcgdolpoijdckmafdnddjoglia)
and [Firefox](https://addons.mozilla.org/en-GB/firefox/addon/codesandbox/),
which add an import button within the UI on GitHub repo pages.

### Accessing imported repos from the dashboard

Lastly, you can now access imported repos from the dashboard. 'Repositories' is 
where all the repos you've imported are collected
together in one place. So you can open or fork them with a click, making
imported GitHub repos just as easy to work with as templates created on
CodeSandbox. This new section on the dashboard is one part of
[a significant overhaul of the dashboard experience](https://codesandbox.io/post/new-dashboard)
that we released last week.

Overall, these updates should make working with GitHub on CodeSandbox easier to
understand and do. Try it out and let us know how you get on.

### Thanks

Thanks to [Christian Alfoni](https://twitter.com/christianalfoni),
[Sara Viera](https://twitter.com/NikkitaFTW), and
[Danny Ruchtie](https://twitter.com/druchtie) for their work on these
improvements. We'd also like to thank those who have provided feedback and
tested these changes along the way.

import { deploy, github, live, npm, search, terminal } from './assets';

export default [
  {
    title: 'NPM Support',
    description:
      'Think of any npm dependency you want to use, we probably support it! You can install a new dependency within seconds.',
    icon: npm,
    link: '#',
    homepage: true,
  },
  {
    title: 'Github integration',
    description:
      'You can easily imported a Github repository in CodeSandbox and make commits. You can also export any Sandbox to a GitHub repository.',
    icon: github,
    link: '#',
    homepage: true,
  },
  {
    title: 'Integrated DevTools',
    description:
      'The preview window has integrated DevTools, like a console, test view and a problem viewer.',
    icon: terminal,
    link: '#',
    homepage: true,
  },
  {
    title: 'Search & Discovery',
    description:
      'Want to know how a library works? You can easily browse through the 1,628,530+ created sandboxes on CodeSandbox. We want this to be a platform where everyone can easily learn and share.',
    icon: search,
    homepage: true,
  },
  {
    title: 'Live Collaboration',
    description:
      'Edit sandboxes together in real time, Google Docs style. Use Classroom Mode to control who can make edits.',
    icon: live,
    link: '#',
    homepage: true,
  },
  {
    title: 'Deploy',
    description:
      "Deploy a production version of your sandbox using ZEIT's Now or Netlify",
    icon: deploy,
    link: '#',
    homepage: true,
  },
];

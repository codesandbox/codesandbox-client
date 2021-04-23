import { personal } from './_personal';

export const business = {
  plans: [
    { name: 'Team Pro', color: '#5962DF' },
    { name: 'Organization', color: '#F7A239' },
    { name: 'Enterprise', color: '#0971F1' },
  ],
  defaultOpen: ['Admin & Security'],
  items: [
    {
      name: 'Admin & Security',
      features: [
        {
          name: 'Dashboard ',
          desc:
            'Organize sandboxes and templates. Search, sort, or modify sandboxes at once',
          available: true,
        },
        {
          name: 'Centralized Billing ',
          desc:
            'Everyone in a single account for easier team management & billing',
          available: true,
        },
        {
          name: 'Sandbox-level Permissions',
          desc: 'Disable the ability to fork or download a shared sandbox',
          available: true,
        },
        {
          name: 'Workspace-level Permissions',
          desc:
            'Disable the ability to fork or download all shared sandboxes in a workspace',
          available: true,
        },
        {
          name: 'Analytics',
          desc: 'Measure impact and refine creations with sandbox analytics',
          available: [false, true, true],
        },
        {
          name: 'Single Sign-On (SSO)',
          desc: 'Integrate your identity management system and enforce SSO',
          available: [false, true, true],
        },
        {
          name: 'Multiple Team Workspaces',
          desc:
            'Bring multiple teams together in a single account to collaborate',
          available: [false, true, true],
        },
        {
          name: 'Priority Customer Support',
          desc: 'Prioritized, fast and helpful support via email',
          available: [false, true, true],
        },
        {
          name: 'Dedicated Account Manager',
          desc: 'A single point of contact for your support needs',
          available: [false, false, true],
        },
        {
          name: 'On-Premise',
          desc: 'Your own instance running on bare-metal or your own cloud',
          available: [false, false, true],
        },
        {
          name: 'Private Cloud',
          desc: 'Your own instance running in a virtual private cloud',
          available: [false, false, true],
        },
      ],
    },
    {
      name: 'Prototyping',
      features: [
        {
          name: 'Unlimited Public Sandboxes',
          desc:
            'Sandboxes, both the preview and code, are available publicly by default',
          available: true,
        },
        {
          name: 'Public NPM Packages ',
          desc: 'Use any of the 1M+ public packages on npm in your sandboxes',
          available: true,
        },
        {
          name: 'Templates',
          desc: 'Start from an official template, or create your own',
          available: true,
        },
        {
          name: 'Static File Hosting',
          desc: 'All static files served via CDN',
          available: [
            '500MB/user, 30MB upload',
            '500MB/user, 30MB upload',
            'Unlimited',
          ],
        },
        {
          name: 'Unlimited Private Sandboxes',
          desc:
            'Set a sandbox as private or unlisted so others can’t see the code',
          available: true,
        },
        {
          name: 'Private GitHub Repos',
          desc:
            'Import and sync repos which are private on GitHub to CodeSandbox',
          available: true,
        },
        {
          name: 'Private NPM Packages',
          desc: 'Use private npm packages from your own custom registry',
          available: true,
        },
      ],
    },
    {
      name: 'Knowledge Sharing',
      features: [
        {
          name: 'Team Workspaces',
          desc:
            'View, edit, and manage public and private sandboxes with a team',
          available: true,
        },
        {
          name: 'Workspace Templates',
          desc: 'Start from an official template, or share your own',
          available: true,
        },
        {
          name: 'Embeds',
          desc: 'Embed sandboxes in docs, blog posts, websites, or tools',
          available: true,
        },
      ],
    },
    {
      name: 'Feedback',
      features: [
        {
          name: 'Unlimited Viewers ',
          desc: 'Add collaborators to view and comment on sandboxes for free',
          available: true,
        },
        {
          name: 'Code Comments',
          desc: 'Add comments about a sandbox or specific code lines',
          available: true,
        },
        {
          name: 'Preview Comments ',
          desc: 'Add comment on the preview in the sandbox',
          available: true,
        },
        {
          name: 'Shareable Links ',
          desc: 'Per sandbox URL with HTTPS support for secure project sharing',
          available: true,
        },
      ],
    },
    personal.items.find(item => item.name === 'Platform'),
  ],
};

// {
//   name: 'Workspace-level Permissions ',
//   desc: 'Embed sandboxes in docs, blog posts, and websites',
//   available: [false, false],
// },
// {
//   name: 'Centralized Billing ',
//   desc: 'A personal portfolio page highlighting your best sandboxes',
//   available: [false, false],
// },

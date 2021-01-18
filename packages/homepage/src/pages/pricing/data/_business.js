import { personal } from './_personal';

export const business = {
  plans: [
    {
      name: 'Team Pro Workspace',
      color: '#5962DF',
    },
    { name: 'Organization', color: '#F7A239' },
    { name: 'Enterprise', color: '#0971F1' },
  ],
  items: [
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
          available: ['10Gb, 30Mb upload', '20Gb, 30Mb upload', 'Unlimited'],
        },
        {
          name: 'Unlimited Private Sandboxes',
          desc:
            "Set a sandbox as private or unlisted so others can't see the code",
          available: true,
        },
        {
          name: 'Private GitHub Repos',
          desc:
            'Import and sync repos which are private on GitHub to CodeSandbox',
          available: true,
        },
        {
          name: 'Always-on Containers',
          desc: 'Always-on Containers',
          available: ['3/user', '5/user', 'Unlimited'],
        },
        {
          name: 'Postman',
          desc: 'Postman',
          available: true,
        },
        {
          name: 'Private NPM',
          desc: 'Private NPM',
          available: true,
        },
      ],
    },
    {
      name: 'Knowledge Sharing',
      features: [
        {
          name: 'Workspaces',
          desc: 'View, edit, and manage sandboxes with a team.',
          available: true,
        },
        {
          name: 'Workspace Templates',
          desc: 'Start from an official template, or create your own',
          available: true,
        },
        {
          name: 'Embeds',
          desc: 'Embed sandboxes in docs, blog posts, and websites',
          available: true,
        },
        {
          name: 'Public Profile',
          desc: 'A personal portfolio page highlighting your best sandboxes.',
          available: true,
        },
        {
          name: 'Folder Subscriptions',
          desc: 'Folder Subscriptions',
          available: true,
        },
        {
          name: 'Slack integration',
          desc: 'Slack integration',
          available: true,
        },
      ],
    },
    {
      name: 'Feedback',
      features: [
        {
          name: 'Unlimited Viewers ',
          desc: 'View, edit, and manage sandboxes with a team.',
          available: true,
        },
        {
          name: 'Code Comments',
          desc: 'Start from an official template, or create your own',
          available: true,
        },
        {
          name: 'Preview Comments ',
          desc: 'Embed sandboxes in docs, blog posts, and websites',
          available: true,
        },
        {
          name: 'Shareable Links ',
          desc: 'A personal portfolio page highlighting your best sandboxes.',
          available: true,
        },
      ],
    },
    {
      name: 'Admin & Security',
      features: [
        {
          name: 'Dashboard ',
          desc:
            'Organize sandboxes and templates. Search, sort, or modify sandboxes at once.',
          available: true,
        },
        {
          name: 'Sandbox-level Permissions',
          desc:
            'Organize sandboxes and templates. Search, sort, or modify sandboxes at once.',
          available: true,
        },
        {
          name: 'Analytics',
          desc: 'Analytics',
          available: ['Sandbox', 'Sandbox and Usage', 'Sandbox and Usage'],
        },
        {
          name: 'Workspace-level Permissions',
          desc: 'Workspace-level Permissions',
          available: true,
        },
        {
          name: 'SSO',
          desc: 'SSO',
          available: [false, true, true],
        },
        {
          name: 'Multiple Workspaces',
          desc: 'Multiple Workspaces',
          available: [false, true, true],
        },
        {
          name: 'Priority Customer Support',
          desc: 'Priority Customer Support',
          available: [false, true, true],
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
//   desc: 'A personal portfolio page highlighting your best sandboxes.',
//   available: [false, false],
// },

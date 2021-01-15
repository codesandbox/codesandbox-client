export const personal = {
  plans: [
    {
      name: 'Personal',
      color: 'white',
      free: true,
    },
    { name: 'Personal Pro Workspace', color: '#0971F1' },
  ],
  items: [
    {
      name: 'Prototyping',
      features: [
        {
          name: 'Unlimited Public Sandboxes',
          desc:
            'Sandboxes, both the preview and code, are available publicly by default',
          available: [true, true],
        },
        {
          name: 'Public NPM Packages ',
          desc: 'Use any of the 1M+ public packages on npm in your sandboxes',
          available: [true, true],
        },
        {
          name: 'Templates',
          desc: 'Start from an official template, or create your own',
          available: [true, true],
        },
        {
          name: 'Static File Hosting',
          desc: 'All static files served via CDN',
          available: ['20Mb total, 7Mb upload', '500Mb total, 30Mb upload'],
        },
        {
          name: 'Unlimited Private Sandboxes',
          desc:
            "Set a sandbox as private or unlisted so others can't see the code",
          available: [false, true],
        },
        {
          name: 'Private GitHub Repos',
          desc:
            'Import and sync repos which are private on GitHub to CodeSandbox',
          available: [false, true],
        },
        {
          name: 'Private NPM Packages',
          desc: 'Use private npm packages from your own customer registry',
          available: [false, true],
        },
      ],
    },
    {
      name: 'Knowledge Sharing',
      features: [
        {
          name: 'Workspaces',
          desc: 'View, edit, and manage sandboxes with a team.',
          available: [true, true],
        },
        {
          name: 'Workspace Templates',
          desc: 'Start from an official template, or create your own',
          available: [true, true],
        },
        {
          name: 'Embeds',
          desc: 'Embed sandboxes in docs, blog posts, and websites',
          available: [true, true],
        },
        {
          name: 'Public Profile',
          desc: 'A personal portfolio page highlighting your best sandboxes.',
          available: [true, true],
        },
      ],
    },
    {
      name: 'Feedback',
      features: [
        {
          name: 'Unlimited Viewers ',
          desc: 'View, edit, and manage sandboxes with a team.',
          available: [true, true],
        },
        {
          name: 'Code Comments',
          desc: 'Start from an official template, or create your own',
          available: [true, true],
        },
        {
          name: 'Preview Comments ',
          desc: 'Embed sandboxes in docs, blog posts, and websites',
          available: [true, true],
        },
        {
          name: 'Shareable Links ',
          desc: 'A personal portfolio page highlighting your best sandboxes.',
          available: [true, true],
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
          available: [true, true],
        },
        {
          name: 'Sandbox-level Permissions',
          desc:
            'Organize sandboxes and templates. Search, sort, or modify sandboxes at once.',
          available: [false, true],
        },
        {
          name: 'Workspace-level Permissions ',
          desc: 'Embed sandboxes in docs, blog posts, and websites',
          available: [false, true],
        },
        {
          name: 'Centralized Billing ',
          desc: 'A personal portfolio page highlighting your best sandboxes.',
          available: [false, true],
        },
      ],
    },
  ],
};

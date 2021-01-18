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
          available: [false, true],
        },
        {
          name: 'Analytics',
          desc: 'Analytics',
          available: ['Overview', 'Overview'],
        },
      ],
    },
    {
      name: 'Platform',
      features: [
        {
          subheading: 'IDE ',
          features: [
            {
              name: 'VS Code powered Editor',
              desc: 'Leverage the power and familiarity of VS Code.',
              available: true,
            },
            {
              name: 'Hot Module Reloading',
              desc: ' See changes as you make them.',
              available: true,
            },
            {
              name: 'Keybindings & Quick Actions',
              desc: 'Perform common tasks speedily.',
              available: true,
            },
            {
              name: 'Console',
              desc: 'Console',
              available: true,
            },
            {
              name: 'Zen Mode',
              desc: 'Zen Mode',
              available: true,
            },
            {
              name: 'Custom Themes',
              desc: 'Custom Themes',
              available: true,
            },
            {
              name: 'Type Acquisition',
              desc: 'Type Acquisition',
              available: true,
            },
            {
              name: 'Vim Mode',
              desc: 'Vim Mode',
              available: true,
            },
            {
              name: 'External Resources',
              desc: 'External Resources',
              available: true,
            },
            {
              name: 'Session Restore',
              desc: 'Session Restore',
              available: true,
            },
            {
              name: 'Prettier',
              desc: 'Prettier',
              available: true,
            },
            {
              name: 'Eslint',
              desc: 'Eslint',
              available: true,
            },
            {
              name: 'Emmet',
              desc: 'Emmet',
              available: true,
            },
            {
              name: 'Configuration UI',
              desc: 'Configuration UI',
              available: true,
            },
            {
              name: 'Export Zip',
              desc: 'Export Zip',
              available: true,
            },
          ],
        },
        {
          subheading: 'Development',
          features: [
            {
              name: 'Server Control Panel',
              desc: 'Server Control Panel',
              available: true,
            },
            {
              name: 'Multiple Ports',
              desc: 'Multiple Ports',
              available: true,
            },
            {
              name: 'Secrets',
              desc: 'Secrets',
              available: true,
            },
            {
              name: 'Test Viewer',
              desc: 'Test Viewer',
              available: true,
            },
            {
              name: 'Problem Viewer',
              desc: 'Problem Viewer',
              available: true,
            },
            {
              name: 'React DevTools',
              desc: 'React DevTools',
              available: true,
            },
            {
              name: 'Terminal',
              desc: 'Terminal',
              available: true,
            },
          ],
        },
        {
          subheading: 'Live',
          features: [
            {
              name: 'Collaborating editing',
              desc: 'Collaborating editing',
              available: ['5 invites/month', 'Unlimited'],
            },
            {
              name: 'In-editor Chat',
              desc: 'In-editor Chat',
              available: true,
            },
            {
              name: 'Classroom Mode',
              desc: 'Classroom Mode',
              available: true,
            },
          ],
        },
        {
          subheading: 'Standard Integrations',
          features: [
            {
              name: 'GitHub import/export',
              desc: 'GitHub import/export',
              available: true,
            },
            {
              name: 'Vercel Deploy',
              desc: 'Vercel Deploy',
              available: true,
            },
            {
              name: 'Stackbit',
              desc: 'Stackbit',
              available: true,
            },
            {
              name: 'VS Code Plugin',
              desc: 'VS Code Plugin',
              available: true,
            },
          ],
        },
        {
          subheading: 'API',
          features: [
            {
              name: 'Define API',
              desc: 'Define API',
              available: true,
            },
            {
              name: 'Import CLI',
              desc: 'Import CLI',
              available: true,
            },
            {
              name: 'CodeSandbox CI',
              desc: 'CodeSandbox CI',
              available: true,
            },
          ],
        },
      ],
    },
  ],
};

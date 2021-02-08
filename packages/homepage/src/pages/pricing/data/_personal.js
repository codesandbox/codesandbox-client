export const personal = {
  plans: [
    {
      name: 'Personal',
      color: 'white',
      free: true,
    },
    { name: 'Personal Pro', color: '#0971F1' },
  ],
  defaultOpen: ['Admin & Security', 'Prototyping'],
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
          name: 'Sandbox-level Permissions',
          desc: 'Disable the ability to fork or download a shared sandbox',
          available: [false, true],
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
          available: ['20MB total, 7MB upload', '500MB total, 30MB upload'],
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
          name: 'Team Workspaces',
          desc: 'View, edit, and manage public sandboxes with a team',
          available: true,
        },
        {
          name: 'Workspace Templates',
          desc: 'Start from an official template, or create your own',
          available: true,
        },
        {
          name: 'Embeds',
          desc: 'Embed sandboxes in docs, blog posts, websites, or tools',
          available: true,
        },
        {
          name: 'Public Profile',
          desc: 'A personal portfolio page highlighting your best sandboxes',
          available: true,
        },
      ],
    },
    {
      name: 'Feedback',
      features: [
        {
          name: 'Unlimited Workspace Viewers ',
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
    {
      name: 'Platform',
      features: [
        {
          subheading: 'IDE ',
          features: [
            {
              name: 'VS Code powered Editor',
              desc: 'Leverage the power and familiarity of VS Code',
              available: true,
            },
            {
              name: 'Hot Module Reloading',
              desc: 'See changes as you make them',
              available: true,
            },
            {
              name: 'Keybindings & Quick Actions',
              desc: 'Perform common tasks speedily',
              available: true,
            },
            {
              name: 'Console',
              desc:
                'View logging and console output to see loading progress and debug issues',
              available: true,
            },
            {
              name: 'Zen Mode',
              desc:
                'Zen mode hides distracting editor elements for demos and screenshots',
              available: true,
            },
            {
              name: 'Custom Themes',
              desc: 'Tweak theme styles with support for all VS Code themes',
              available: true,
            },
            {
              name: 'Type Acquisition',
              desc: 'Typings automatically downloaded for every dependency',
              available: true,
            },
            {
              name: 'Vim Mode',
              desc:
                'Vim emulation in the editor, powered by the VSCodeVim extension',
              available: true,
            },
            {
              name: 'External Resources',
              desc:
                'Automatically include external resources, like CSS or JS files',
              available: true,
            },
            {
              name: 'Session Restore',
              desc: 'Recover un-saved changes between sessions',
              available: true,
            },
            {
              name: 'Prettier',
              desc: 'Code gets prettified on save according to preferences',
              available: true,
            },
            {
              name: 'ESLint',
              desc: 'Code is linted automatically',
              available: true,
            },
            {
              name: 'Emmet',
              desc:
                'Expand abbreviations with Emmet.io in all JS, HTML, and CSS files',
              available: true,
            },
            {
              name: 'Configuration UI',
              desc:
                'Edit config files for npm, Prettier, Netlify, Vercel, TypeScript, and JavaScript',
              available: true,
            },
            {
              name: 'Export Zip',
              desc: 'Download your sandbox as a zip',
              available: true,
            },
          ],
        },
        {
          subheading: 'Development',
          features: [
            {
              name: 'Server Control Panel',
              desc: 'Restart the sandbox or server',
              available: true,
            },
            {
              name: 'Multiple Ports',
              desc:
                'Container apps can listen on one or more ports simultaneously',
              available: true,
            },
            {
              name: 'Secrets',
              desc:
                'Hide sensitive information in your app and access them via environment variables',
              available: true,
            },
            {
              name: 'Test Viewer',
              desc: 'Showing test results alongside your code',
              available: true,
            },
            {
              name: 'Problem Viewer',
              desc: 'See errors clearly with our user-friendly overlay',
              available: true,
            },
            {
              name: 'React DevTools',
              desc: 'Integration of React’s own DevTools into the editor',
              available: true,
            },
            {
              name: 'Terminal',
              desc: 'Run scripts and commands from a terminal',
              available: true,
            },
          ],
        },
        {
          subheading: 'Live',
          features: [
            {
              name: 'Collaborative editing',
              desc: 'Work on code and edit sandboxes with multiple people',
              available: true,
            },
            {
              name: 'In-editor Chat',
              desc:
                'Chat with collaborators about the code you’re all working on',
              available: true,
            },
            {
              name: 'Classroom Mode',
              desc: 'Use Classroom Mode to control who can make edits or watch',
              available: true,
            },
          ],
        },
        {
          subheading: 'Integrations',
          features: [
            {
              name: 'GitHub Import & Export',
              desc:
                'Import and sync public repos, export, create commits and open PRs',
              available: true,
            },
            {
              name: 'Vercel Deploy',
              desc: 'Deploy a production version of your sandbox to Vercel',
              available: true,
            },
            {
              name: 'Netlify Deploy',
              desc: 'Deploy a production version of your sandbox to Netlify',
              available: true,
            },
            {
              name: 'Stackbit',
              desc: 'Import projects generated by Stackbit',
              available: true,
            },
          ],
        },
        {
          subheading: 'API',
          features: [
            {
              name: 'Define API',
              desc: 'Programmatically create sandboxes via an API',
              available: true,
            },
            {
              name: 'Import CLI',
              desc: 'Import a local project to CodeSandbox easily',
              available: true,
            },
            {
              name: 'CodeSandbox CI',
              desc: 'A GitHub integration that auto-builds from pull requests',
              available: true,
            },
          ],
        },
      ],
    },
  ],
};

# SSE Loading Screen

Standalone loading screen shown while CodeSandbox sandboxes are initializing. This package is built separately and deployed as static HTML files.

## Installation

This package is part of the CodeSandbox monorepo workspace. Dependencies are installed at the root level via yarn workspaces.

### Standalone Installation

If you need to install dependencies for this package in isolation (outside the workspace), you can run:

```bash
yarn install-dependencies
```

**Note:** The `install-dependencies` script includes a conditional check to prevent recursive installation loops when running from the workspace root. It checks for the presence of `../../node_modules` (workspace root) and skips installation if found, since dependencies are already installed via the workspace. This allows the script to work both:
- Within the workspace context (skips, uses workspace dependencies)
- In standalone mode (runs `yarn install`)

## Development

```bash
yarn start    # Start development server
yarn build    # Build for production
```

## Usage

This package is deployed as a standalone HTML page that:
- Connects to CodeSandbox's SSE infrastructure via Socket.IO
- Displays real-time sandbox initialization progress
- Shows terminal output during sandbox startup
- Automatically reloads when the sandbox is ready


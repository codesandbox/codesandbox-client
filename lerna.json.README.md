# Lerna Configuration

This file configures Lerna for the CodeSandbox monorepo.

## Configuration Details

- **`packages`**: Defines package discovery patterns (`packages/*` and `standalone-packages/*`)
- **`version`**: Set to `"independent"` to allow each package to version independently
- **`useNx`**: Disabled (set to `false`)
- **`useWorkspaces`**: Not set (defaults to `false`)

## Why `useWorkspaces` is not enabled

Lerna is intentionally configured to use its own package discovery mechanism rather than delegating to Yarn workspaces. This is because:

1. **Standalone packages** (`codesandbox-browserfs`, `vscode-extensions`, `vscode-textmate`) have their own installation processes:
   - Some use `npm` instead of `yarn`
   - Some require special setup scripts (e.g., decompressing extensions)
   - They may have different dependency resolution needs

2. **Independent management**: Standalone packages are built and deployed independently, so they don't need to be part of the Yarn workspace dependency graph.

3. **Script execution**: Lerna's independent package discovery allows us to run `install-dependencies` scripts across all packages (both workspace and standalone) during the `postinstall` hook.

## Expected Warning

When running Lerna commands, you may see:

```
lerna WARN EWORKSPACES Workspaces exist in the root package.json, but Lerna is not configured to use them.
```

**This warning is expected and can be safely ignored.** It occurs because Lerna uses its own package discovery rather than Yarn workspaces. This configuration is intentional and working as designed.

For more details, see the [Package Management](../CONTRIBUTING.md#package-management) section in CONTRIBUTING.md.


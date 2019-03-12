# Dev setup
Clone this repo, run `npm install` and `gulp build`, and in VS Code run the `launch as server` launch config. This will start the adapter as a server listening on port 4712.

Then in the debuggee, you can add `"debugServer": "4712"` to connect to your instance of the debug adapter, instead of the installed one. See [this page](https://code.visualstudio.com/docs/extensions/example-debuggers) for more details on debugging a debug adapter.

Since most of the code for this extension is in the [vscode-chrome-debug-core](https://github.com/Microsoft/vscode-chrome-debug-core) library, if you need to make changes, then you will probably want to clone both repos. You can run `npm link` from the `vscode-chrome-debug-core` directory, and `npm link vscode-chrome-debug-core` from this directory to make this repo use your cloned version of that library.

## Testing
See the project under testapp/ for a bunch of test scenarios crammed onto one page.

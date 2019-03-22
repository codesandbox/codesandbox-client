# Contribute to this Project

Hey! Feelin' geeky? Juicy! You'll get started in a bit :smirk:.

_Before jumping in, I'd say that the **VS Code** [theme color reference](https://code.visualstudio.com/docs/getstarted/theme-color-reference) is a really great resource to get started with._

### Follow these steps...

1. Fork this repo
1. Open the forked repo in your terminal and run `npm install`
1. Start to watch for changes with `npm start` - this runs a nodemon task that creates a `.vsix` file in the root directory and will automatically recompile any changes you make - it might take a while to create.
1. Open the repo in **VS Code**
1. Launch your command palette <kbd>Ctrl/Cmd+Shift+P</kbd> and type **VSIX**. Select the one that says **Extensions: Install from VSIX...**
1. Load the **VSIX** file you created a few steps back
1. Set your editor to use this theme - change the name in `package.json` to something like "Palenight Dev" so you can differentiate from the initial theme you installed from the Marketplace.
1. Go to the debug sidebar `View → Debug`
1. Hit the green arrow beside "Launch Extension" - opens a new window
1. Make a change, and then hit the refresh button on your debug toolbar - this is in your first editor - not the one that popped open.
1. Wait a sec, your changes should now be reflected!
1. Duplicate your changes in the other **variants**
1. Commit your changes to your **fork** of this repo
1. Send a **PR** that contains detailed information about your change
1. I'll review it, and decide whether it should be merged :book:.
1. Voila! You're done :wink:.

## Things You might want to help with

- [ ] Automate copying every change in a JSON file into the **variants**. Say, you edit _palenight.json_, your changes should get duplicated in _palenight-italic.json_ and _palenight-operator.json_.
- [ ] Create a functionality that'll group the code for each language in separate files. Say, _javascript.json_, _css.json_ and would automtically be merged into one file on build.
- [ ] Create a variant for users with eye issues.
- [ ] Help update the [Atom version](https://github.com/whizkydee/atom-material-palenight-syntax).
- [ ] Support this project. [Get me coffee](https://me.wallet.ng/mrolaolu) :smirk: :pray:!

Thanks for showing interest and helping out :ok_hand:!

If you get stuck somewhere, reach out to me on [Twitter](https://twitter.com/mrolaolu) :smile:.

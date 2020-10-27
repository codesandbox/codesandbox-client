# vscode-emmet-helper
A helper module to use emmet modules with Visual Studio Code


Visual Studio Code extensions that provide language service and want to provide emmet abbreviation expansions 
in auto-complete can include this module and use the `doComplete` method.
Just pass the one of the emmet supported syntaxes that you would like the completion provider to use along with other parameters that you would generally pass to a completion provider.

If `emmet.includeLanguages` has a mapping for your language, then the builit-in emmet extension will provide 
html emmet abbreviations. Ask the user to remove the mapping, if your extension decides to provide
emmet completions using this module

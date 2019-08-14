# Nunjucks for Visual Studio Code
Nunjucks template syntax definition specifically for **Microsoft Visual Studio Code**.

```
>ext install extension nunjucks
```
## vscode-nunjucks support these file extensions
```
.nunjucks, .nunjs, .nj, .njk, .html, .htm, .template, .tmpl, .tpl
```

### Although you are free to use any file extension you wish for your Nunjucks template files, the Nunjucks community has adopted `.njk`
<br />
<br />

## Install Nunjucks from Visual Studio Code *(recomended method)*
To install the [Nunjucks extension](https://marketplace.visualstudio.com/items/ronnidc.nunjucks) directly from Visual Studio Code you need to proceed with theese four simple steps:

1. Go to *View > Command Palette* (Mac OSX: `cmd+shift+P`, Windows: `ctrl+shift+P`)
2. Run the following command in the Command Palette field: `>ext install extension` and hit enter.
3. Then type `nunjucks` and hit enter.
4. After instalation is complete restart the Code app and you are all set up for start writing Nunjucks templates in Visual Studio Code.

![Install the Nunjucks extension from Code Command Palette](https://github.com/ronnidc/vscode-nunjucks/raw/master/images/vscode-command-palette-nunjucks.png)

## Or install the Nunjucks extension for Visual Studio Code manually
To install Nunjucks manually for Visual Studio Code you need to proceed with theese five steps:

1. Download this [vscode-nunjucks](https://github.com/ronnidc/vscode-nunjucks) repo from GitHub
2. Navigate to the `<user home>/.vscode/extensions` directory on your computer.
3. Create a new folder and name it `nunjucks`
4. Copy all content of this repository into the `<user home>/.vscode/extensions/nunjucks` directory.
5. Restart the Code app and you are all set up for start writing Nunjucks templates in Code.

![Nunjucks example in Code](https://github.com/ronnidc/vscode-nunjucks/raw/master/images/vscode-nunjucks.png)

## What's in the folder
* This folder contains all of the files necessary for the vscode-nunjucks extension
* `package.json` - this is the manifest file in which the language support is declared and the location of the grammar file that has been copied into the extension is defined.
* `syntaxes/nunjucks.tmLanguage` - this is the Text mate grammar file that is used for tokenization
* `nunjucks.configuration.json` - this the language configuration, defining the tokens that are used for comments and brackets.

### For more information
* [Visual Studio Code Docs](https://code.visualstudio.com/docs)
* [Nunjucks by Mozilla](https://mozilla.github.io/nunjucks/)

### Credits
This extension is based on the [Sublime-nunjucks](https://github.com/mogga/sublime-nunjucks) language file.
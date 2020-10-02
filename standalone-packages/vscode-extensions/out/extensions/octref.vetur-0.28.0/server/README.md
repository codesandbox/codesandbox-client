## Vue Language Server

[VLS](https://www.npmjs.com/package/vls) (Vue Language Server) is a language server implementation compatible with [Language Server Protocol](https://github.com/microsoft/language-server-protocol).

Vetur is the VS Code client consuming `vls`.

It's possible for other LSP compatible editors to build language server clients that consume `vls`.

## Usage

There are two ways to integrate `vls` into editors:

1. As a global executable.

  Example Client: https://github.com/autozimu/LanguageClient-neovim

  First, install VLS globally.

  ```bash
  npm install vls -g
  # or yarn global add vls
  ```

  This will provide you the global `vls` command.

  Then, configure LanguageClient to use `vls`. In this example, we write below configuration into `init.vim`.


  ```vim
  let g:LanguageClient_serverCommands = {
      \ 'vue': ['vls']
      \ }
  ```

2. As a plugin dependency.

  Example: https://github.com/HerringtonDarkholme/atom-vue

  First, install vls as a local dependency.

  ```bash
  npm install vls --save
  # or yarn add vls
  ```

  Then, require the vls, this would typically look like:

  ```ts
  class VueLanguageClient extends AutoLanguageClient {
    startServerProcess () {
      return cp.spawn('node', [require.resolve('vls/dist/htmlServerMain')])
    }
  }
  ```

3. As extension of [coc.nvim](https://github.com/neoclide/coc.nvim)

  Install [coc.nvim](https://github.com/neoclide/coc.nvim) in your vim/neovim.

  Then, run vim command

  ```
  :CocInstall coc-vetur
  ```

## Vue Language Server

`vue-language-server` is a language server implementation compatible with [`language-server-protocol`](https://github.com/Microsoft/language-server-protocol).

Vetur is the VS Code client consuming `vue-language-server`.

It's possible for other `language-server-protocol` compatible editors to build language server clients that consume VLS.

## Usage

There are two ways to integrate `vue-language-server` into editors:

1. As a global executable.

  Example Client: https://github.com/autozimu/LanguageClient-neovim

  First, install VLS globally.

  ```bash
  npm install vue-language-server -g
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

  First, install vue-language-server as a local dependency.

  ```bash
  npm install vue-language-server --save
  ```

  Then, require the vue-language-server, this would typically look like:

  ```ts
  class VueLanguageClient extends AutoLanguageClient {
    startServerProcess () {
      return cp.spawn('node', [require.resolve('vue-language-server/dist/htmlServerMain')])
    }
  }
  ```

3. As extension of [coc.nvim](https://github.com/neoclide/coc.nvim)

  Install [coc.nvim](https://github.com/neoclide/coc.nvim) in your vim/neovim.

  Then, run vim command

  ```
  :CocInstall coc-vetur
  ```

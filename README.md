# [CodeSandbox](https://codesandbox.io) [![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg)](https://discord.gg/KE3TbEZ) [![All Contributors](https://img.shields.io/badge/all_contributors-14-orange.svg?style=flat-square)](#contributors) [![Build Status](https://travis-ci.org/CompuIves/codesandbox-client.svg?branch=master)](https://travis-ci.org/CompuIves/codesandbox-client)

An online code editor with a focus on React.

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/sm85y5UkG7rypodi9kLCd9pm/CompuIves/codesandbox-client'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/sm85y5UkG7rypodi9kLCd9pm/CompuIves/codesandbox-client.svg' />
</a>

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

The JavaScript community has sharing as its selling point. It has the biggest open source community and every day new ideas and proposals are shared on Twitter. This is great and a really strong point, but the side effect of this is that there are a lot of tools and configurations to consider before you can start building.

CodeSandbox aims to solve this by allowing developers to simply go to a URL in their browser to start building. This not only makes it easier to get started, it also makes it easier to share. You can just share your created work by sharing the URL, others can then (without downloading) further develop on these sandboxes.

## Organization

The CodeSandbox client is currently divided in to 5 parts.

- `app`: The editor and profile page
- `sandbox`: The preview pane of the editor
- `embed`: The embedded version of CodeSandbox (which you can embed on medium)
- `common`: The common parts between `sandbox`, `embed` and `app`
- `homepage`: Homepage!

This version of CodeSandbox is using the production server as source of truth, this is specified by the environment variable `LOCAL_SERVER`. It's not yet possible to sign in using this version, I haven't figured out how to handle this yet.

## Installation

To install the project you need to have `yarn` and `node`, to start:

```bash
yarn
yarn start
```

## Other CodeSandbox repositories

CodeSandbox consists several separate servers, some of these are open sourced.

- Client: the web application
- Server: the Phoenix API server
- Nginx: Nginx config files
- [Git Extractor](https://github.com/CompuIves/codesandbox-git-extractor): responsible for extracting the source from a GitHub repository
- [CLI](https://github.com/CompuIves/codesandbox-cli): the CLI to upload a CodeSandbox project from your command line

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars0.githubusercontent.com/u/587016?v=3" width="100px;"/><br /><sub>Ives van Hoorne</sub>](http://ivesvh.com)<br />[💬](#question-CompuIves "Answering Questions") [📝](#blog-CompuIves "Blogposts") [🐛](https://github.com/CompuIves/codesandbox-client/issues?q=author%3ACompuIves "Bug reports") [💻](https://github.com/CompuIves/codesandbox-client/commits?author=CompuIves "Code") [🎨](#design-CompuIves "Design") [📖](https://github.com/CompuIves/codesandbox-client/commits?author=CompuIves "Documentation") [💡](#example-CompuIves "Examples") [🚇](#infra-CompuIves "Infrastructure (Hosting, Build-Tools, etc)") [👀](#review-CompuIves "Reviewed Pull Requests") [⚠️](https://github.com/CompuIves/codesandbox-client/commits?author=CompuIves "Tests") [🔧](#tool-CompuIves "Tools") | [<img src="https://avatars0.githubusercontent.com/u/887639?v=3" width="100px;"/><br /><sub>Donavon West</sub>](http://donavon.com)<br />[💻](https://github.com/CompuIves/codesandbox-client/commits?author=donavon "Code") | [<img src="https://avatars0.githubusercontent.com/u/5266810?v=3" width="100px;"/><br /><sub>Jeff Allen</sub>](http://www.jeffallen.io/)<br />[💻](https://github.com/CompuIves/codesandbox-client/commits?author=vueu "Code") | [<img src="https://avatars0.githubusercontent.com/u/1089897?v=3" width="100px;"/><br /><sub>Ben Gummer</sub>](https://github.com/bengummer)<br />[💻](https://github.com/CompuIves/codesandbox-client/commits?author=bengummer "Code") | [<img src="https://avatars3.githubusercontent.com/u/154732?v=3" width="100px;"/><br /><sub>James Gillmore</sub>](http://twitter.com/faceyspacey)<br />[💻](https://github.com/CompuIves/codesandbox-client/commits?author=faceyspacey "Code") [🐛](https://github.com/CompuIves/codesandbox-client/issues?q=author%3Afaceyspacey "Bug reports") | [<img src="https://avatars1.githubusercontent.com/u/9636410?v=4" width="100px;"/><br /><sub>Ade Viankakrisna Fadlil</sub>](https://musify.id)<br />[💻](https://github.com/CompuIves/codesandbox-client/commits?author=viankakrisna "Code") | [<img src="https://avatars1.githubusercontent.com/u/1854763?v=4" width="100px;"/><br /><sub>Tushar Sonawane</sub>](https://twitter.com/tushkiz)<br />[💻](https://github.com/CompuIves/codesandbox-client/commits?author=Tushkiz "Code") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars3.githubusercontent.com/u/1239401?v=4" width="100px;"/><br /><sub>Johann Hubert Sonntagbauer</sub>](https://github.com/johann-sonntagbauer)<br />[🐛](https://github.com/CompuIves/codesandbox-client/issues?q=author%3Ajohann-sonntagbauer "Bug reports") [💻](https://github.com/CompuIves/codesandbox-client/commits?author=johann-sonntagbauer "Code") | [<img src="https://avatars2.githubusercontent.com/u/9586897?v=4" width="100px;"/><br /><sub>Joachim Seminck</sub>](https://github.com/jseminck)<br />[💻](https://github.com/CompuIves/codesandbox-client/commits?author=jseminck "Code") | [<img src="https://avatars3.githubusercontent.com/u/5210019?v=4" width="100px;"/><br /><sub>Subramanya Chakravarthy</sub>](http://chakrihacker.github.io)<br />[💻](https://github.com/CompuIves/codesandbox-client/commits?author=chakrihacker "Code") | [<img src="https://avatars3.githubusercontent.com/u/23088?v=4" width="100px;"/><br /><sub>Robert (Robby) O'Connor</sub>](http://robby.oconnor.ninja)<br />[🚇](#infra-robbyoconnor "Infrastructure (Hosting, Build-Tools, etc)") | [<img src="https://avatars0.githubusercontent.com/u/2083930?v=4" width="100px;"/><br /><sub>Bogdan Luca</sub>](https://github.com/lbogdan)<br />[🐛](https://github.com/CompuIves/codesandbox-client/issues?q=author%3Albogdan "Bug reports") [💻](https://github.com/CompuIves/codesandbox-client/commits?author=lbogdan "Code") | [<img src="https://avatars3.githubusercontent.com/u/6177621?v=4" width="100px;"/><br /><sub>Divjot Singh</sub>](http://bogas04.github.io)<br />[💻](https://github.com/CompuIves/codesandbox-client/commits?author=bogas04 "Code") | [<img src="https://avatars3.githubusercontent.com/u/5249539?v=4" width="100px;"/><br /><sub>Jason Nall</sub>](http://www.jsonnull.com)<br />[💻](https://github.com/CompuIves/codesandbox-client/commits?author=jsonnull "Code") |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

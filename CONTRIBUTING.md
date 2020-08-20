# Contributing to CodeSandbox Client

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Code Organization](#code-organization)
- [Setting Up the project locally](#setting-up-the-project-locally)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Add yourself as a contributor](#add-yourself-as-a-contributor)

## Code of Conduct

У нас есть кодекс поведения, который вы можете найти [здесь](./CODE_OF_CONDUCT.md) и каждый вкладчик должен подчиняться этим правилам. 
Любые вопросы или PR, которые не соответствуют кодексу поведения, могут быть закрыты.

## Code Organization

Клиент CodeSandbox в настоящее время разделен на 5 частей. Мы используем `lerna`, чтобы
разделять зависимости между этими частями.

- `app`: Редактор, поиск, страница профиля, вложение и песочница.
- `homepage`: Сайт Гэтсби на главной странице.
- `common`: Все общие части между этими пакетами, многоразовые JS.
- `codesandbox-api`: npm-пакет, который отвечает за коммуникацию
  между песочницей и редактором.
- `codesandbox-browserfs`: Встроенная браузерная файловая система, эмулирующая API файловой системы Node JS 
и поддерживающая хранение и извлечение файлов из различных бэкэндов. 
Вставлено из [https://github.com/jvilk/BrowserFS](https://github.com/jvilk/BrowserFS), 
с дополнительным [CodeSandbox backend](https://github.com/codesandbox/codesandbox-client/blob/master/standalone-packages/codesandbox-browserfs/src/backend/CodeSandboxFS.ts).

Эта версия CodeSandbox использует в качестве источника правды свой сервер, что задается переменной окружения `LOCAL_SERVER`. 
При работе с функцией, для которой нужно, чтобы вы вошли в систему, вы можете войти в систему
[https://codesandbox.io/](https://codesandbox.io/) и скопировать содержимое "Ключ к локальному хранению данных в вашей среде разработки" на [http://localhost:3000/](http://localhost:3000/).  
**Осторожнее с обработкой маркера**, так как любой, кто его знает, может войти в систему, как вы, и прочитать/записать доступ ко всему содержимому CodeSandbox!

**Работа над вашим первым запросом на вытягивание?** Вы можете узнать, как это сделать из этой _free_ серии  
[Как внести свой вклад в проект с открытым исходным кодом на GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

## Setting Up the project locally

Для установки проекта необходимо иметь `yarn` и `node`.

1.  [Fork](https://help.github.com/articles/fork-a-repo/) проект, клонируй свой fork:

    ```sh
    # Клонируй свой fork
    git clone https://github.com/<your-username>/codesandbox-client.git

    # Перейдите к новому клонированному каталогу
    cd codesandbox-client
    ```

2.  Ваша среда должна быть запущена с Node v. 10
    - `.nvmrc` конфигурация существует в repo root, указывая версию v.10.x.x
    - вы можете использовать fnm (fnm use) для изменения текущей версии узла на версию, указанную в .nvmrc
3.  с самого начала проекта: `yarn` для установки всех зависимостей
    - убедитесь, что у вас последняя версия `yarn`
4.  из корня проекта: `yarn start`
    - это создаст зависимости (`codesandbox-api` и `codesandbox-browserfs`) и запустит среду разработки `app`, 
    доступную по адресу [http://localhost:3000/s/new](http://localhost:3000/s/new) 
    - на последующих запусках вы также можете обойти построение и использование зависимостей
      `yarn start:fast`
    - если вы хотите работать на главной странице, начните с `yarn start:home`, она будет доступна на [http://localhost:8000/](http://localhost:8000/).

> Совет: Держите ветку `master`, указывающую на исходный репозиторий, и делайте запросы на вытаскивание из ветки на вилке. Чтобы сделать это, беги:
>
> ```sh
> git remote add upstream https://github.com/codesandbox/codesandbox-client.git
> git fetch upstream
> git branch --set-upstream-to=upstream/master master
> ```
>
> This will add the original repository as a "remote" called "upstream," then
> fetch the git information from that remote, then set your local `master`
> branch to use the upstream master branch whenever you run `git pull`. Then you
> can make all of your pull request branches based on this `master` branch.
> Whenever you want to update your version of `master`, do a regular `git pull`.

5. If you want to debug the state of the app, install the
   [Cerebral Debugger](https://github.com/cerebral/cerebral-debugger/releases)
   and connect it to the port `8383`. After that, if you refresh the app, you
   should be able to see the state, the sequences executed and so on. See
   [documentation](https://cerebraljs.com/docs/introduction/devtools.html) for
   reference.

## Submitting a Pull Request

Please go through existing issues and pull requests to check if somebody else is
already working on it, we use `someone working on it` label to mark such issues.

Also, make sure to run the tests and lint the code before you commit your
changes.

```sh
yarn test
yarn lint
```

Before running `yarn lint`, you must have build our `common` and `notifications`
packages.

```sh
yarn build:deps
```

## Add yourself as a contributor

This project follows the
[all-contributors](https://github.com/all-contributors/all-contributors)
specification. Contributions of any kind welcome!

To add yourself to the table of contributors on the `README.md`, please use the
automated script as part of your PR:

```sh
yarn contributors:add
```

Follow the prompt and commit `.all-contributorsrc` and `README.md` in the PR.

Thank you for taking the time to contribute! 👍

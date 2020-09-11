# BrowserFS v2.0.0-beta
> BrowserFS - это файловая система в браузере, которая имитирует [Node JS file system API](http://nodejs.org/api/fs.html) и поддерживает хранение и извлечение файлов из различных бэкэндов. BrowserFS также прекрасно интегрируется в файловую систему Emscripten.

[![Build Status](https://travis-ci.org/jvilk/BrowserFS.svg?branch=master)](https://travis-ci.org/jvilk/BrowserFS)
[![Build Status](https://ci.appveyor.com/api/projects/status/bammh2x1bud8h7a5/branch/master?svg=true)](https://ci.appveyor.com/project/jvilk/browserfs/branch/master)
[![NPM version](https://badge.fury.io/js/browserfs.svg)](http://badge.fury.io/js/browserfs)

### Бэкэнды

BrowserFS обладает широкими возможностями расширения и поставляется с множеством серверных частей файловой системы:

* `HTTPRequest`: Загружает файлы по запросу с веб-сервера через `XMLHttpRequest` или `fetch`.
* `LocalStorage`: Сохраняет файлы в браузере `localStorage`.
* `HTML5FS`: Сохраняет файлы в HTML5 `FileSystem` API.
* `IndexedDB`: Сохраняет файлы в объектной базе данных браузера `IndexedDB`.
* `Dropbox`: Сохраняет файлы в учетной записи Dropbox пользователя.
  * Примечание. Вы предоставляете этой файловой системе аутентифицированный [DropboxJS V2 JS SDK client](https://github.com/dropbox/dropbox-sdk-js).
* `InMemory`: Хранит файлы в памяти. Таким образом, это временное хранилище файлов, которое очищается, когда пользователь уходит.
* `ZipFS`: FS с поддержкой zip-файлов только для чтения. Лениво распаковывает файлы по мере доступа к ним.
  * Поддерживает DEFLATE прямо из коробки.
  * Есть супер старые zip-файлы? [The `browserfs-zipfs-extras` package](https://github.com/jvilk/browserfs-zipfs-extras) добавляет поддержку EXPLODE, UNREDUCE, и UNSHRINK.
* `IsoFS`: Смонтирует файл .iso в файловую систему.
  * Поддерживает расширения Microsoft Joliet и Rock Ridge до стандарта ISO9660.
* `WorkerFS`: Позволяет смонтировать файловую систему BrowserFS, настроенную в основном потоке в WebWorker, или наоборот!
* `MountableFileSystem`: Позволяет монтировать несколько файловых систем в одну иерархию каталогов, как в операционных системах на базе * nix.
* `OverlayFS`: Смонтируйте файловую систему только для чтения как чтение-запись, наложив поверх нее файловую систему с возможностью записи. Как и Docker overlayfs, он будет записывать только измененные файлы в файловую систему с возможностью записи.
* `AsyncMirror`: Используйте асинхронный бэкэнд синхронно. Бесценен для Emscripten; позвольте вашим приложениям Emscripten записывать файлы в большие хранилища без дополнительных усилий!
  * Note: Загружает все содержимое файловой системы в синхронный сервер во время построения. Выполняет синхронные операции в памяти и ставит их в очередь для зеркалирования на асинхронном сервере.
* `FolderAdapter`: Оборачивает файловую систему и переносит все взаимодействия в подпапку этой файловой системы.
* `Emscripten`: Позволяет монтировать файловые системы Emscripten внутри BrowserFS.

Отдельные библиотеки могут определять больше бэкендов, если они расширяют класс `BaseFileSystem`. Несколько серверных ВМ могут быть активны одновременно в разных местах в иерархии каталогов.

Дополнительные сведения см. В [документации API для BrowserFS].(https://jvilk.com/browserfs/2.0.0-beta/index.html).

### Сборка

Предпосылки:

* Node and NPM
* Запустите `yarn install` (или `npm install`), чтобы установить локальные зависимости и построить BrowserFS.

Минифицированную сборку можно найти в `dist/browserfs.min.js`, а неминифицированную сборку можно найти в `dist/browserfs.js`.

Пользовательские сборки:

Если вы хотите собрать BrowserFS с подмножеством доступных бэкендов, измените `src/core/backends.ts`, чтобы включить только нужные вам бэкенды, и перестройте.

### Польза

Используя BrowserFS.configure (), вы можете легко настроить BrowserFS на использование различных типов файловых систем.

Вот простой пример использования файловой системы с поддержкой LocalStorage:

```html
<script type="text/javascript" src="browserfs.min.js"></script>
<script type="text/javascript">
  // Устанавливает глобальные объекты в окно:
  // * Буфер
  // * require ( if already defined) требуется (monkey-patches, если они уже определены)
  // * процесс
  // Вы можете передать произвольный объект, если не хотите загрязнять // глобальное пространство имён.
  BrowserFS.install(window);
  // Настраивает BrowserFS для использования файловой системы LocalStorage.
  BrowserFS.configure({
    fs: "LocalStorage"
  }, function(e) {
    if (e) {
      // Произошла ошибка!
      throw e;
    }
    // В остальном BrowserFS готов к использованию!
  });
</script>
```

Теперь вы можете написать такой код:

```js
var fs = require('fs');
fs.writeFile('/test.txt', 'Cool, I can do this in the browser!', function(err) {
  fs.readFile('/test.txt', function(err, contents) {
    console.log(contents.toString());
  });
});
```

Следующий код монтирует zip-файл в `/zip`, хранилище в памяти в `/tmp` и локальное хранилище браузера IndexedDB в `/home`:

```js
// Примечание. Это новый API извлечения в браузере. Вы тоже можете использовать XHR.
fetch('mydata.zip').then(function(response) {
  return response.arraybuffer();
}).then(function(zipData) {
  var Buffer = BrowserFS.BFSRequire('buffer').Buffer;

  BrowserFS.configure({
    fs: "MountableFileSystem",
    options: {
      "/zip": {
        fs: "ZipFS",
        options: {
          // Обернуть как объект-буфер.
          zipData: Buffer.from(zipData)
        }
      },
      "/tmp": { fs: "InMemory" },
      "/home": { fs: "IndexedDB" }
    }
  }, function(e) {
    if (e) {
      // An error occurred.
      throw e;
    }
    // В противном случае BrowserFS готов к использованию!
  });
});
```

### Использование с Browserify и Webpack

BrowserFS публикуется как модуль UMD, поэтому вы можете либо включить его на свою веб-страницу в теге `script`, либо связать его с вашим любимым сборщиком модулей JavaScript.

Вы также можете использовать BrowserFS, чтобы снабдить свое приложение модулями `fs`, `path` и `buffer`, а также глобальными объектами `Buffer` и `process`. BrowserFS содержит модули прокладки для `fs`, `buffer`, `path` и `process`, которые вы можете использовать с Webpack и Browserify.

Webpack:

```javascript
module.exports = {
  resolve: {
    // Используйте наши версии модулей Node.
    alias: {
      'fs': 'browserfs/dist/shims/fs.js',
      'buffer': 'browserfs/dist/shims/buffer.js',
      'path': 'browserfs/dist/shims/path.js',
      'processGlobal': 'browserfs/dist/shims/process.js',
      'bufferGlobal': 'browserfs/dist/shims/bufferGlobal.js',
      'bfsGlobal': require.resolve('browserfs')
    }
  },
  // ТРЕБУЕТСЯ, чтобы избежать проблемы "Uncaught TypeError: BrowserFS.BFSRequire не является функцией"
  // See: https://github.com/jvilk/BrowserFS/issues/201
  module: {
    noParse: /browserfs\.js/
  },
  plugins: [
    // Откройте глобальные файлы BrowserFS, process и Buffer.
    // NOTE: Если вы собираетесь использовать BrowserFS в теге скрипта, вам не нужно 
    // предоставлять глобальный файл BrowserFS.
    new webpack.ProvidePlugin({ BrowserFS: 'bfsGlobal', process: 'processGlobal', Buffer: 'bufferGlobal' })
  ],
  // ОТКЛЮЧИТЕ встроенный процесс Webpack и полифилы буфера!
  node: {
    process: false,
    Buffer: false
  }
};
```

Browserify:

```javascript
var browserfsPath = require.resolve('browserfs');
var browserifyConfig = {
  // Переопределите встроенные функции Browserify для buffer/fs/path.
  builtins: Object.assign({}, require('browserify/lib/builtins'), {
    "buffer": require.resolve('browserfs/dist/shims/buffer.js'),
    "fs": require.resolve("browserfs/dist/shims/fs.js"),
    "path": require.resolve("browserfs/dist/shims/path.js")
  }),
  insertGlobalVars: {
    // процесс, буфер и глобальные файлы BrowserFS.
    // BrowserFS global не требуется, если вы включаете browserfs.js 
    // в тег скрипта.
    "process": function () { return "require('browserfs/dist/shims/process.js')" },
    'Buffer': function () { return "require('buffer').Buffer" },
    "BrowserFS": function() { return "require('" + browserfsPath + "')" }
  }
};
```

### Использование с Node

Вы можете использовать BrowserFS с Node. Просто добавьте `browserfs` как зависимость NPM, и `require('browserfs')`.
В результате этого действия возвращается тот же самый глобальный объект `BrowserFS`, который описан выше.

Если вам нужно, чтобы BrowserFS возвращал объекты буфера узла (вместо объектов, реализующих тот же интерфейс),
вместо этого просто `require('browserfs/dist/node/index')`.

### Использование с Emscripten

Вы можете использовать любые *синхронные* файловые системы BrowserFS с Emscripten!
Сохраняйте определенные папки в файловой системе Emscripten в `localStorage` или разрешайте Emscripten синхронно загружать файлы из другой папки по запросу.

Include `browserfs.min.js` into the page, and configure BrowserFS prior to running your Emscripten code. Then, add code similar to the following to your `Module`'s `preRun` array: 
Включите на страницу `browserfs.min.js` и настройте BrowserFS перед запуском кода Emscripten. Затем добавьте код, аналогичный приведенному ниже, в массив `preRun` вашего `Module`:

```javascript
/**
 * Монтирует файловую систему с поддержкой localStorage в папку /data файловой системы Emscripten.
 */
function setupBFS() {
  // Скачайте плагин BrowserFS Emscripten FS.
  var BFS = new BrowserFS.EmscriptenFS();
  // Создайте папку, которую мы превратим в точку монтирования.
  FS.createFolder(FS.root, 'data', true, true);
  // Смонтируйте корневую папку BFS в папку `/data`.
  FS.mount(BFS, {root: '/'}, '/data');
}
```

Note: Не используй `BrowserFS.install(window)` на странице с приложением Emscripten! Emscripten будет обманут, заставив думать, что он работает в Node JS.

Если вы хотите использовать асинхронный бэкэнд BrowserFS с Emscripten (например, Dropbox), вам нужно сначала обернуть его в файловую систему `AsyncMirror`:

```javascript
/**
 * Запустите это перед запуском модуля Emscripten.
 * @param dropboxClient Аутентифицированный клиент DropboxJS.
 */
function asyncSetup(dropboxClient, cb) {
  // Это обертывает Dropbox в файловую систему AsyncMirror.
  // BrowserFS загрузит весь Dropbox в
  // InMemory файловую систему и 
  // зеркальные операции для их синхронизации.
  BrowserFS.configure({
    fs: "AsyncMirror",
    options: {
      sync: {
        fs: "InMemory"
      },
      async: {
        fs: "Dropbox",
        options: {
          client: dropboxClient
        }
      }
    }
  }, cb);
}
function setupBFS() {
  // Скачайте плагин BrowserFS Emscripten FS.
  var BFS = new BrowserFS.EmscriptenFS();
  // Создайте папку, которую мы превратим в точку монтирования.
  FS.createFolder(FS.root, 'data', true, true);
  // Смонтируйте корневую папку BFS в папку `/data`.
  FS.mount(BFS, {root: '/'}, '/data');
}
```

### Тестирование

Чтобы запустить модульные тесты, просто запустите `npm test`.

### Цитирование

BrowserFS - это компонент [Doppio](http://doppiojvm.org/) и [Browsix](https://browsix.org/) исследовательских проектов из лаборатории ПЛАЗМЫ Массачусетского университета в Амхерсте. Если вы решите использовать BrowserFS в проекте, который ведет к публикации, пожалуйста, цитируйте научные статьи на [Doppio](https://dl.acm.org/citation.cfm?doid=2594291.2594293) и [Browsix](https://dl.acm.org/citation.cfm?id=3037727):

> John Vilk и Emery D. Berger. Doppio: Преодолевая языковой барьер браузера. 
В *материалах 35-й конференции ACM SIGPLAN по проектированию и реализации языков программирования*
(2014), pp. 508–518.

```bibtex
@inproceedings{VilkDoppio,
  author    = {John Vilk and
               Emery D. Berger},
  title     = {{Doppio: Breaking the Browser Language Barrier}},
  booktitle = {Proceedings of the 35th {ACM} {SIGPLAN} Conference on Programming Language Design and Implementation},
  pages     = {508--518},
  year      = {2014},
  url       = {http://doi.acm.org/10.1145/2594291.2594293},
  doi       = {10.1145/2594291.2594293}
}
```

> Bobby Powers, John Vilk, and Emery D. Berger. Browsix: Bridging the Gap Between Unix and the Browser. In *Proceedings of the Twenty-Second International Conference on Architectural Support for Programming Languages and Operating Systems* (2017), pp. 253–266.

```bibtex
@inproceedings{PowersBrowsix,
  author    = {Bobby Powers and
               John Vilk and
               Emery D. Berger},
  title     = {{Browsix: Bridging the Gap Between Unix and the Browser}},
  booktitle = {Proceedings of the Twenty-Second International Conference on Architectural
               Support for Programming Languages and Operating Systems},
  pages     = {253--266},
  year      = {2017},
  url       = {http://doi.acm.org/10.1145/3037697.3037727},
  doi       = {10.1145/3037697.3037727}
}
```


### Лицензия

BrowserFS находится под лицензией MIT. Подробности см. В разделе `ЛИЦЕНЗИЯ`.

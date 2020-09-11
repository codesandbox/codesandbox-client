# Документация по API BrowserFS

BrowserFS - это файловая система в браузере, которая имитирует [Node JS file system API](http://nodejs.org/api/fs.html) и поддерживает хранение и извлечение файлов из различных бэкэндов. BrowserFS также прекрасно интегрируется в файловую систему Emscripten.

[README](https://github.com/jvilk/browserfs) предоставляет обзор того, как интегрировать BrowserFS в ваш проект. В этой документации по API основное внимание будет уделено тому, как использовать BrowserFS после того, как вы добавили его в свой проект.

## Настройка BrowserFS

Основной интерфейс BrowserFS [задокументирован здесь](modules/_core_browserfs_.html).

Прежде чем вы сможете использовать BrowserFS, вам необходимо ответить на следующие вопросы:

1. **Какие серверные части файловой системы я хочу использовать?**
2. **Какие параметры конфигурации передать каждому?**

### Какой бэкэнд (ы) использовать?

Прежде чем вы сможете использовать BrowserFS, вы должны инициализировать его с помощью бэкэнда с одной корневой файловой системой. Думайте о каждом сервере как о «запоминающем устройстве». Он может быть доступен только для чтения (zip-файл или ISO), для чтения-записи (локальное хранилище IndexedDB в браузере) и даже может быть облачным хранилищем (Dropbox).

Если вам нужно использовать несколько «запоминающих устройств», вы можете использовать бэкэнд `MountableFileSystem` для «монтирования» бэкэндов в разных местах в иерархии каталогов.

Доступны всевозможные файловые системы адаптеров, позволяющие упростить доступ к файлам, хранящимся в Emscripten, файлам, хранящимся в другом контексте (например, веб-воркер), изолировать файловые операции с определенной папкой, синхронно обращаться к асинхронным серверам хранения и т.д.!

Просмотрите «Обзор» серверных ВМ ниже, чтобы узнать о них и их возможностях.

### Какие варианты конфигурации для каждого?

Разные серверные ВМ требуют разных параметров конфигурации. Просмотрите страницу документации для каждого внутреннего интерфейса, который вы хотите использовать, и обратите внимание на параметры, переданные его методу `Create()`. Некоторые из них являются необязательными, другие - обязательными.

### Собираем всё вместе

После того, как вы узнаете, какие серверные модули хотите использовать, и параметры, которые нужно передать каждому, вы можете настроить BrowserFS с помощью одного объекта конфигурации:

```javascript
BrowserFS.configure({
  fs: "name of file system type" // from Backends table below,
  options: {
    // опции для файловой системы
  }
}, function (e) {
  if (e) {
    // Произошла ошибка.
    throw e;
  }
  // В противном случае вы можете взаимодействовать с настроенными бэкэндами через наш полифил Node FS!
  var fs = BrowserFS.BFSRequire('fs');
  fs.readdir('/', function(e, contents) {
    // etc.
  });
});
```

В случае, когда объект параметров файловой системы принимает другую файловую систему, вы можете вложить другой объект конфигурации вместо фактического объекта файловой системы:

```javascript
var Buffer = BrowserFS.BFSRequire('buffer').Buffer;
BrowserFS.configure({
  fs: "OverlayFS",
  options: {
    readable: {
      fs: "ZipFS",
      options: {
        zipData: Buffer.from(zipDataAsArrayBuffer)
      }
    },
    writable: {
      fs: "LocalStorage"
    }
  }
}, function(e) {

});
```

Используя этот метод, легко настроить точки монтирования в `MountableFileSystem`:

```javascript
BrowserFS.configure({
  fs: "MountableFileSystem",
  options: {
    '/tmp': { fs: "InMemory" },
    '/home': { fs: "IndexedDB" },
    '/mnt/usb0': { fs: "LocalStorage" }
  }
}, function(e) {

});
```

### Расширенное использование

Если `BrowserFS.configure` вам не по душе, вы можете вручную создать экземпляры серверных модулей файловой системы и передать корневой сервер в BrowserFS через его функцию `BrowserFS.initialize()`.

```javascript
BrowserFS.FileSystem.LocalStorage.Create(function(e, lsfs) {
  BrowserFS.FileSystem.InMemory.Create(function(e, inMemory) {
    BrowserFS.FileSystem.IndexedDB.Create({}, function(e, idbfs) {
      BrowserFS.FileSystem.MountableFileSystem.Create({
        '/tmp': inMemory,
        '/home': idbfs,
        '/mnt/usb0': lsfs
      }, function(e, mfs) {
        BrowserFS.initialize(mfs);
        // BFS теперь готов к использованию!
      });
    });
  });
});
```

## Использование с Emscripten

После того, как вы настроили BrowserFS, вы можете смонтировать его в файловую систему Emscripten. Более подробная информация находится в BrowserFS [README](https://github.com/jvilk/browserfs).

## Обзор бэкэндов

**Ключ:**

* ✓ means 'yes'
* ✗ means 'no'
* ? means 'зависит от конфигурации'

Обратите внимание, что к любой асинхронной файловой системе можно получить синхронно, используя [AsyncMirror](classes/_backend_asyncmirror_.asyncmirror.html) файловая система за счет предварительной загрузки всей файловой системы в какой-то синхронный бэкэнд (например, `InMemory`).

<table>
  <tr>
    <th></th>
    <th></th>
    <th colspan="3">Дополнительная поддержка API</th>
  </tr>
  <tr>
    <th>Имя бэкэнда</th>
    <th>Записываемый?</th>
    <th>Синхронный</th>
    <th>Свойства</th>
    <th>Ссылки</th>
  </tr>
  <tr>
    <td><a href="classes/_backend_asyncmirror_.asyncmirror.html">AsyncMirror</a></td>
    <td>✓</td>
    <td>✓</td>
    <td>✗</td>
    <td>✗</td>
  </tr>
  <tr>
    <td><a href="classes/_backend_dropbox_.dropboxfilesystem.html">Dropbox</a></td>
    <td>✓</td>
    <td>✗</td>
    <td>✗</td>
    <td>✗</td>
  </tr>
  <tr>
    <td><a href="classes/_backend_emscripten_.emscriptenfilesystem.html">Emscripten</a></td>
    <td>✓</td>
    <td>✓</td>
    <td>✓</td>
    <td>✓</td>
  </tr>
  <tr>
    <td><a href="classes/_backend_folderadapter_.folderadapter.html">FolderAdapter</a></td>
    <td>?</td>
    <td>?</td>
    <td>?</td>
    <td>✗</td>
  </tr>
  <tr>
    <td><a href="classes/_backend_html5fs_.html5fs.html">HTML5FS</a></td>
    <td>✓</td>
    <td>✗</td>
    <td>✗</td>
    <td>✗</td>
  </tr>
  <tr>
    <td><a href="classes/_backend_indexeddb_.indexeddbfilesystem.html">IndexedDB</a></td>
    <td>✓</td>
    <td>✗</td>
    <td>✗</td>
    <td>✗</td>
  </tr>
  <tr>
    <td><a href="classes/_backend_inmemory_.inmemoryfilesystem.html">InMemory</a></td>
    <td>✓</td>
    <td>✓</td>
    <td>✗</td>
    <td>✗</td>
  </tr>
  <tr>
    <td><a href="classes/_backend_isofs_.isofs.html">IsoFS</a></td>
    <td>✗</td>
    <td>✓</td>
    <td>✗</td>
    <td>✗</td>
  </tr>
  <tr>
    <td><a href="classes/_backend_localstorage_.localstoragefilesystem.html">LocalStorage</a></td>
    <td>✓</td>
    <td>✓</td>
    <td>✗</td>
    <td>✗</td>
  </tr>
  <tr>
    <td><a href="classes/_backend_mountablefilesystem_.mountablefilesystem.html">MountableFileSystem</a></td>
    <td>?</td>
    <td>?</td>
    <td>?</td>
    <td>?</td>
  </tr>
  <tr>
    <td><a href="classes/_backend_overlayfs_.overlayfs.html">OverlayFS</a></td>
    <td>✓</td>
    <td>?</td>
    <td>?</td>
    <td>✗</td>
  </tr>
  <tr>
    <td><a href="classes/_backend_httprequest_.httprequest.html">HTTPRequest</a></td>
    <td>✗</td>
    <td>✓</td>
    <td>✗</td>
    <td>✗</td>
  </tr>
  <tr>
    <td><a href="classes/_backend_workerfs_.workerfs.html">WorkerFS</a></td>
    <td>?</td>
    <td>✗</td>
    <td>?</td>
    <td>?</td>
  </tr>
  <tr>
    <td><a href="classes/_backend_zipfs_.zipfs.html">ZipFS</a></td>
    <td>✗</td>
    <td>✓</td>
    <td>✗</td>
    <td>✗</td>
  </tr>
</table>

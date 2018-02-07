# BrowserFS API Documentation

BrowserFS is an in-browser file system that emulates the [Node JS file system API](http://nodejs.org/api/fs.html) and supports storing and retrieving files from various backends. BrowserFS also integrates nicely into the Emscripten file system.

The [README](https://github.com/jvilk/browserfs) provides an overview of how to integrate BrowserFS into your project. This API documentation will focus on how to use BrowserFS once you have added it to your project.

## Configuring BrowserFS

The main BrowserFS interface is [documented here](modules/_core_browserfs_.html).

Before you can use BrowserFS, you need to answer the following questions:

1. **What file system backends do I want to use?**
2. **What configuration options do I pass to each?**

### What Backend(s) to Use?

Before you can use BrowserFS, you must initialize it with a single root file system backend. Think of each backend
as a "storage device". It can be read-only (a zip file or an ISO), read-write (browser-local IndexedDB storage),
and it can even be cloud storage (Dropbox).

If you need to use multiple "storage devices", you can use the `MountableFileSystem` backend to "mount" backends at
different locations in the directory hierarchy.

There are all sorts of adapter file systems available to make it easy to access files stored in Emscripten, files stored in a different context (e.g., a web worker), isolate file operations to a particular folder, access asynchronous storage backends synchronously, and more!

Check out the "Overview" of backends below for a list of backends and their capabilities.

### What Configuration Options For Each?

Different backends require different configuration options. Review the documentation page for each backend you want to use, and note the options passed to its `Create()` method. Some are optional, others are required.

### Putting It All Together

Once you know the backend(s) you want to use, and the options to pass to each, you can configure BrowserFS with a single configuration object:

```javascript
BrowserFS.configure({
  fs: "name of file system type" // from Backends table below,
  options: {
    // options for the file system
  }
}, function (e) {
  if (e) {
    // An error occurred.
    throw e;
  }
  // Otherwise, you can interact with the configured backends via our Node FS polyfill!
  var fs = BrowserFS.BFSRequire('fs');
  fs.readdir('/', function(e, contents) {
    // etc.
  });
});
```

In the case where a file system's options object takes another file system, you can nest another configuration object
in place of the actual file system object:

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

Using this method, it's easy to configure mount points in the `MountableFileSystem`:

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

### Advanced Usage

If `BrowserFS.configure` is not to your liking, you can manually instantiate file system backends and pass the root backend to BrowserFS via its `BrowserFS.initialize()` function.

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
        // BFS is now ready to use!
      });
    });
  });
});
```

## Usage with Emscripten

Once you have configured BrowserFS, you can mount it into the Emscripten file system. More details are in the BrowserFS [README](https://github.com/jvilk/browserfs).

## Overview of Backends

**Key:**

* ✓ means 'yes'
* ✗ means 'no'
* ? means 'depends on configuration'

Note that any asynchronous file system can be accessed synchronously using the [AsyncMirror](classes/_backend_asyncmirror_.asyncmirror.html) file system at the cost of preloading the entire file system into some synchronous backend (e.g., `InMemory`).

<table>
  <tr>
    <th></th>
    <th></th>
    <th colspan="3">Optional API Support</th>
  </tr>
  <tr>
    <th>Backend Name</th>
    <th>Writable?</th>
    <th>Synchronous</th>
    <th>Properties</th>
    <th>Links</th>
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

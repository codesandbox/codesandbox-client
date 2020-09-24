# Workerpool embedded worker example

In a browser environment, the `script` argument in `workerpool.pool(script)` can also be a data URL like `'data:application/javascript;base64,...'`. This allows embedding the bundled code of a worker in your main application, which is demonstrated in this example.

> !!! Note that this example only works in the browser, not in node.js !!!

## Run

Install the dependencies:

```
npm install
```

Build the embedded worker (`dist/worker.embedded.js`) and the bundled version of `app.js` (`dist/app.bundle.js`):

```
npm run build
```

Then open app.html in your browser.

## How does it work?

1.   The script worker.js is bundled into `dist/worker.bundle.js` using Webpack
2.   From the worker bundle, a base64 encoded data url is created and stored in a JavaScript file `dist/worker.embedded.js`. This file looks like:
     ```js
     module.exports = 'data:application/javascript;base64,...';
     ```
3.   The file app.js loads the embedded worker and passes it to the worker pool like:

    ```js
    var workerDataUrl = require('./dist/worker.embedded');

    // create a worker pool
    var pool = workerpool.pool(workerDataUrl);
    ```
4.  The application `app.js` is bundled using Webpack, and the bundle is loaded into app.html.

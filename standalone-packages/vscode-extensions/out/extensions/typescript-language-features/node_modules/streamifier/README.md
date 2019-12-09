streamifier
===========

#### Converts a Buffer/String into a readable stream ####

[![npm][npm-image]][npm-url]

<a name="createReadStream"></a>
___module_.createReadStream(object[, options]) : Readable__

Returns a Readable stream.

The `object` can be of any data type. If it is a Buffer or a string, the available `options` are [`highWaterMark` and `encoding`](http://nodejs.org/api/stream.html#stream_new_stream_readable_options), otherwise the Readable stream is automatically set in [object mode](http://nodejs.org/api/stream.html#stream_object_mode) and the `options` parameter is ignored.

[npm-image]: https://img.shields.io/npm/v/streamifier.svg?style=flat
[npm-url]: https://npmjs.org/package/streamifier
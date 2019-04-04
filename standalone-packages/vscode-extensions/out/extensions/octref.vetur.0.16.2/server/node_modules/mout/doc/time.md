# time #

Utilities for time manipulation.


## now():Number

Returns the number of milliseconds elapsed since 1 January 1970 00:00:00 UTC.
Uses `Date.now()` if available.

### Example

```js
now(); // 1335449614650
```



## parseMs(ms):Object

Parse timestamp (milliseconds) into an object `{milliseconds:number,
seconds:number, minutes:number, hours:number, days:number}`.

### Example

```js
// {days:27, hours:4, minutes:26, seconds:5, milliseconds:454}
parseMs(2348765454);
```



## toTimeString(ms):String

Convert timestamp (milliseconds) into a time string in the format "[H:]MM:SS".

### Example

```js
toTimeString(12513);   // "00:12"
toTimeString(951233);  // "15:51"
toTimeString(8765235); // "2:26:05"
```

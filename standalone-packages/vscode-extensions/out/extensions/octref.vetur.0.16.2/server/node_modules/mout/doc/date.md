# date #

Date utilities.



## isLeapYear(fullYear|date):Boolean

Checks if it's a [leap year](http://en.wikipedia.org/wiki/Leap_year) according
to the Gregorian calendar.

see: [`totalDaysInMonth()`](#totalDaysInMonth)

```js
isLeapYear(2012); // true
isLeapYear(2013); // false
isLeapYear(new Date(2012, 2, 28)); // true
```



## parseIso(str):Number

Parses an [ISO8601](http://en.wikipedia.org/wiki/Iso8601) date and returns the
number of milliseconds since January 1, 1970, 00:00:00 UTC, or `NaN` if it is
not a valid ISO8601 date.

This parses *all* ISO8601 dates, including dates without times, [ordinal
dates](https://en.wikipedia.org/wiki/ISO_8601#Ordinal_dates), and the compact
representation (omitting delimeters). The only exception is [ISO week
dates](https://en.wikipedia.org/wiki/ISO_week_date), which are not parsed.

If no time zone offset is specified, it assumes UTC time.

```js
// Jan 01, 1970 00:00 GMT
parseIso('1970-01-01T00:00:00')    // 0
parseIso('1970-001')               // 0
parseIso('1970-01-01')             // 0
parseIso('19700101T000000.00')     // 0
parseIso('1970-01-01T02:00+02:00') // 0

// Jan 02, 2000 20:10 GMT+04:00
parseIso('2000-01-02T20:10+04:00') // 946829400000
```


## totalDaysInMonth(fullYear, monthIndex):Number

Returns the amount of days in the month taking into consideration leap years
(following Gregorian calendar).

see: [`isLeapYear()`](#isLeapYear)

```js
totalDaysInMonth(2008, 1); // 29 (leap year)
totalDaysInMonth(2009, 1); // 28

// you can also pass a Date object as single argument
totalDaysInMonth( new Date(2013, 0, 1) ); // 31
```


-------------------------------------------------------------------------------

For more usage examples check specs inside `/tests` folder. Unit tests are the
best documentation you can get...


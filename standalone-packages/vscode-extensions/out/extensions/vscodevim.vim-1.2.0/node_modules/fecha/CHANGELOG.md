### 2.3.2
Added typescript definitions to NPM

### 2.3.0
Added strict version of date parser that returns null on invalid dates (may use strict version in v3)

### 2.2.0
Fixed a bug when parsing Do format dates

## 2.0.0
Fecha now throws errors on invalid dates in `fecha.format` and is stricter about what dates it accepts. Dates must pass `Object.prototype.toString.call(dateObj) !== '[object Date]'`.

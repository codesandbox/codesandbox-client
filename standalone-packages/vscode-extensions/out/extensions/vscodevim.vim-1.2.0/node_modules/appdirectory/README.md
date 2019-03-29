[![Build Status](https://travis-ci.org/MrJohz/appdirectory.png?branch=master)](https://travis-ci.org/MrJohz/appdirectory)
[![Coverage Status](https://coveralls.io/repos/MrJohz/appdirectory/badge.png)](https://coveralls.io/r/MrJohz/appdirectory)

# AppDirectory

AppDirectory is a port of Python's [appdirs][] module.  It can be used as a small cross-platform tool to find the correct directory for an application to use for persistence.  It isn't perfect, but it might be useful.

### Usage
AppDirectory offers one export: the `AppDirectory` constructor:

```
var AppDirectory = require('appdirectory')
var dirs = new AppDirectory('mycoolappname')
```

`AppDirectory` can be instantiated either with a single string (the application's name) or an object containing more information about the application.

```
var dirs = new AppDirectory({
    appName: "mycoolapp", // the app's name, kinda self-explanatory
    appAuthor: "Superman", // The author's name, or (more likely) the name of the company/organisation producing this software.
                           // Only used on Windows, if omitted will default to appName.
    appVersion: "v6000", // The version, will be appended to certain dirs to allow for distinction between versions.
                         // If it isn't present, no version parameter will appear in the paths
    useRoaming: true, // Should AppDirectory use Window's roaming directories?  (Defaults to false)
    platform: "darwin" // You should almost never need to use this, it will be automatically determined
})
```

Now to get some actual paths.

```
dirs.userData() // e.g. /home/awesomeuser/Library/Application Support/mycoolapp on Macs
dirs.userConfig() // e.g. /home/awesomeuser/.config/mycoolapp on linux etc.
dirs.userCache() // e.g. C:\Users\awesomeuser\AppData\Local\mycoolapp\mycoolapp\Cache on Windows 7 (and Vista, I believe)
dirs.userLogs() // e.g. /home/awesomeuser/.cache/mycoolapp/log
```

That's pretty much all there is to it.


### Todo
- Fix site* functions
- Test all user* functions

### Known Limitations
> Note: All this limitations have been fixed by virtue of removing the site* functions.  The aim is to add them back in, at which point they will still exist, as one's a design decision, and the other's unfixable as far as I can tell.  However, at this point, there are no known limitations to AppDirectory!  (Feel free to tell me about new limitations by filing an issue.)
- ~~On Windows Vista, the site-config and site-data directories are hidden system directories, which may cause issues.  I don't have a copy of Vista to hand to play around with how well this works, though, so YMMV.~~
- ~~On unix-likes (including those with XDG-compliance), requesting the site-config and site-data directories will return just one directory, even in cases where the XDG* variables contain more than one individual path.  (Specifically, it will be the first path AppDirectory finds.)~~

[appdirs]: <https://pypi.python.org/pypi/appdirs/>